<template>
  <div>
    <ErrorCard v-if="error" :error="error" />
    <div v-else>
      <div v-if="isMobile">
        <div @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
          <div class="header">
            <div class="carousel-card" v-bind:style="style(currentCard.type)">
              <CardBarcode :currentCard="currentCard" />
            </div>
            <div class="indicators">
              <span v-for="(card, index) in cards" :key="card.id" :class="{ 'dot-active': index === currentCardIndex }"
                class="dot"></span>
            </div>
          </div>
          <PromotionList :currentCard="currentCard" />
        </div>
      </div>
      <div v-else>
        <div class="carousel">
        <div v-for="card in cards" :key="card.id">
          <div class="carousel-card" v-bind:style="style(card.type)">
              <CardBarcode :currentCard="currentCard" />
            </div>
          <PromotionList :currentCard="card" />
        </div>
        </div>
      </div>
    </div>


  </div>
</template>
  
<script lang="ts">
import CardBarcode from './BarcodeCard.vue';
import PromotionList from './ListOfPromotions.vue';
import ErrorCard from './ErrorCard.vue'





export default {
  components: {
    CardBarcode,
    PromotionList,
    ErrorCard
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      isLoading: true,
      error: null as any,
      cards: [] as { id: number, type: string }[],
      currentCardIndex: 0,
      scrollInProgress: false,
      touchStartX: 0,
      touchStartTime: 0
    };
  },
  methods: {
    setCookie(id: String, access_token: String, type: String, date: Date) {
      var cookieValue = id +
        "=" + access_token +
        "&" + type
        + "; expires=" + date.toUTCString();
      document.cookie = cookieValue;
    },
    style(type) {
      switch (type) {
        case 'normal':
          return {
            backgroundColor: "#2196F3"
          }
        case 'premium':
          return {
            backgroundColor: "#c48c39"
          }
      }
    },
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartTime = Date.now();
    },
    handleTouchMove(event) {
      if (!this.scrollInProgress) {
        const touchMoveX = event.touches[0].clientX;
        const touchDeltaX = touchMoveX - this.touchStartX;

        if (Math.abs(touchDeltaX) > 50) {
          this.scrollInProgress = true;
          const timePassed = Date.now() - this.touchStartTime;
          if (touchDeltaX > 0 && timePassed < 300) {
            this.navigate('previous');
          } else if (touchDeltaX < 0 && timePassed < 300) {
            this.navigate('next');
          }
        }
      }
    },
    handleTouchEnd() {
      this.scrollInProgress = false;
    },
    navigate(direction) {
      if (direction === 'next') {
        this.currentCardIndex = (this.currentCardIndex + 1) % this.cards.length;
      } else if (direction === 'previous') {
        this.currentCardIndex = (this.currentCardIndex - 1 + this.cards.length) % this.cards.length;
      }
    },
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  computed: {
    currentCard() {
      return this.cards[this.currentCardIndex];
    },
    isMobile() {
      return this.windowWidth <= 768;
    }
  },

  async beforeMount() {
    if (document.cookie !== '') {
      document.cookie.split(';').forEach((cookie) => {
        var cookieValues = cookie.split("=")
        var cardValues = cookieValues[1].split("&");
        this.cards.push({
          id: parseInt(cookieValues[0].trim()),
          type: cardValues[1].trim(),
        })
      })
      this.isLoading = false;
    } else {
      try {
        const response = await fetch('/data-api/graphql', {
          method: 'POST',
          body: JSON.stringify({
            query: `
          {
            cards(filter: {active: {eq: true}}) {
              items {
                id
                access_token
                expires_at
                type
              }
            }
          }
        `
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          this.error = response;
          throw new Error('Network response was not OK');
        }

        const result = await response.json();
        result.data.cards.items.forEach((card) => {
          const now = Date.now();
          const expires_at = new Date(card.expires_at);
          const date = new Date(expires_at)
          this.setCookie(card.id, card.access_token, card.type, date)
        })
        this.cards = result.data.cards.items;
      } catch (error) {
        console.log('An error occurred:', error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleWindowResize);
  }
};
</script>
  
<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 999;
}

.indicators {
  display: flex;
  justify-content: center;
  margin-top: 8px;
  margin-bottom: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #F5F5F5;
  border-radius: 50%;
  margin: 0 4px;
  transition: background-color 0.3s;
}

.dot.dot-active {
  background-color: #BDBDBD;
}

.carousel {
  display: flex;
  justify-content: center;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  white-space: nowrap;
  width: 100%;
}

.carousel-item {
  display: inline-block;
  scroll-snap-align: start;
  width: 290px;
}

.carousel-card {
  padding: 16px;
  display: flex;
  justify-content: center;

}

.carousel-promotions {}

.skeleton-loader {
  width: 347px;
  height: 106px;
  background-color: #f0f0f0;
  /* Placeholder background color */
  border-radius: 4px;
  /* Rounded corners */
  padding: 16px;
  /* Placeholder padding */

  /* Animated gradient background */
  background-image: linear-gradient(90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%);
  background-size: 400% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: -100% 50%;
  }
}

/* Button styles */
.button {
  background-color: white;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  margin-right: 8px;
  transition: background-color 0.3s;

}

.button:active {
  background-color: #ccc;
}


/* Icon styles */
.button i.material-icons {
  font-size: 36px;
  color: #2196F3;
}
</style>