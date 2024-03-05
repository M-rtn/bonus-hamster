<template>
  <div>
      <div>
        <div class="info-wrapper">
        </div>
        <div class="loader-wrapper" v-if="isLoading">
          <div class="loader"></div>
      </div>
      <InfoCard v-else-if="currentCard.type == 'premium' && !error"/>
      <ErrorCard v-if="error" :error="error" /> 
        <PromotionCard v-else v-for="promotion in filteredPromotions" :key="promotion.offerId"
          :promotion="promotion" :currentCard="currentCard" @updatePromotion="onUpdatePromotion"/>
      </div>
    </div>
</template>
<script lang="ts">

import PromotionCard from './PromotionCard.vue';
import ErrorCard from './ErrorCard.vue';
import InfoCard from './InfoCard.vue';



export default {
  components: {
    PromotionCard,
    ErrorCard,
    InfoCard
  },
  props: {
    currentCard: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      error: null as any,
      showNextWeek: false,
      isWeek: false,
      promotions: [] as {
        offerId: number,
        segmentId: number,
        offerStartDate: string,
        image: string,
        discountLabel: string,
        segmentDescription: string,
        salesUnitSize: string,
        bonusPeriodDescription: string,
        activationStatus: string
      }[],
    };
  },
  methods: {
    async getPromotions(id: string) {
      this.error = null;
      this.promotions = [];
      try {
        const response = await fetch('/api/promotions/' + this.setWeek + '/' + id, {
          method: 'GET',
          mode: 'no-cors',
          headers: {
            'content-type': 'application/json',
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            throw {
              code: response.status,
              message: "Not Authorized"
            }
          } else {
            throw {
              code: 500,
              message: "Network Error"
            }
          }
        }
        const data = await response.json();
        this.createCards(data);
      } catch (error) {
       this.isLoading = false;
      this.error = {
          status: 500,
          statusText: error
      }
      }
    },
    createCards(data: any) {
      this.promotions = [];
      for (const promotionKey of Object.keys(data.bonusGroupOrProducts)) {
        const promotion = data.bonusGroupOrProducts[promotionKey];
        if (promotion.bonusGroup) {
          let newPromotion = {
            offerId: promotion.bonusGroup.offerId,
            segmentId: promotion.bonusGroup.segmentId,
            offerStartDate: promotion.bonusGroup.offerStartDate,
            image: promotion.bonusGroup.images[0].url,
            discountLabel: promotion.bonusGroup.discountLabels[0].defaultDescription,
            segmentDescription: promotion.bonusGroup.segmentDescription,
            salesUnitSize: promotion.bonusGroup.salesUnitSize,
            bonusPeriodDescription: promotion.bonusGroup.bonusPeriodDescription,
            activationStatus: promotion.bonusGroup.activationStatus,
          }
          this.promotions.push(newPromotion)
        } else if (promotion.product) {
          let newPromotion = {
            offerId: promotion.product.offerId,
            segmentId: promotion.product.segmentId,
            offerStartDate: promotion.product.offerStartDate,
            image: promotion.product.images[0].url,
            discountLabel: promotion.product.bonusMechanism,
            segmentDescription: promotion.product.bonusSegmentDescription,
            salesUnitSize: promotion.product.salesUnitSize,
            bonusPeriodDescription: promotion.product.bonusPeriodDescription,
            activationStatus: promotion.product.activationStatus
          }
          this.promotions.push(newPromotion)
        }
      }
     this.isLoading = false;
    },
    onUpdatePromotion(offerId: Number){
      this.promotions.forEach(promotion =>{
        if(promotion.offerId === offerId){
          promotion.activationStatus = 'ACTIVATED';
          return;
        }
      })
    }
  },
  computed: {
    filteredPromotions() {
      if(this.currentCard.type == 'premium' && 
      this.promotions.filter(promotion => promotion.activationStatus === 'ACTIVATED').length > 9
      || this.currentCard.type == 'normal' && 
      this.promotions.filter(promotion => promotion.activationStatus === 'ACTIVATED').length > 4 ){
        return this.promotions.filter(promotion => promotion.activationStatus === 'ACTIVATED');
      }
      return this.promotions;
    },
    setWeek() {
      var currentDate = new Date();
      var currentDay = currentDate.getDay(); // Sunday is 0, Monday is 1, and so on...

      if (this.isWeek) {
        var daysUntilNextMonday = 1 + (7 - currentDay) % 7;
        currentDate.setDate(currentDate.getDate() + daysUntilNextMonday);
      }

      return currentDate.toISOString().split('T')[0];
    },


  },
  watch: {
    currentCard: {
      immediate: true,
      handler() {
        if(this.currentCard?.id){
        this.getPromotions(this.currentCard.id);
        }
      },
    },
    isWeek: {
      immediate: false,
      handler() {
        if(this.currentCard?.id){
        this.getPromotions(this.currentCard.id);
        }
      },
    }
  },
  mounted() {
    const dayOfWeek = new Date().getDay();
    this.showNextWeek = dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  }
};
</script>

  
<style scoped>
.info-wrapper {
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.toggleWrapper {
  padding-left: 16px;

}


input[type="checkbox"] {
  opacity: 0;
  width: 0;
  height: 0;
}

input:disabled+.toggle {
  background-color: black;

}

.toggle {
  cursor: pointer;
  display: inline-block;
  position: relative;
  width: 100px;
  height: 36px;
  background-color: #ccc;
  border-radius: 84px;
  transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

.toggle:before {
  content: 'NOW';
  position: absolute;
  left: 40px;
  top: 3px;
  font-size: 18px;
  color: white;
  z-index: 1;
}

.toggle:after {
  content: 'NEXT';
  position: absolute;
  right: 40px;
  top: 3px;
  font-size: 18px;
  color: #ccc;
}


.toggle__handler {
  display: inline-block;
  position: relative;
  z-index: 1;
  top: 2px;
  left: 4px;
  width: 30px;
  height: 30px;
  background-color: white;
  border-radius: 50px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform: rotate(-45deg);
}

input:checked+.toggle {
  background-color: #2196F3;
}

input:checked+.toggle:before {
  color: #3498db;
}

input:checked+.toggle:after {
  z-index: 1;
  color: white;
}

input:checked+.toggle .toggle__handler {
  transform: translate3d(62px, 0, 0) rotate(0);
  right: 2px;
}

.loader-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 260px;
}
.loader {
  color: #2196F3;
  position: relative;
  font-size: 11px;
  background: #2196F3;
  animation: escaleY 1s infinite ease-in-out;
  width: 1em;
  height: 4em;
  animation-delay: -0.16s;
}
.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
  left: 2em;
  background: #2196F3;
  width: 1em;
  height: 4em;
  animation: escaleY 1s infinite ease-in-out;
}
.loader:before {
  left: -2em;
  animation-delay: -0.32s;
}

@keyframes escaleY {
  0%, 80%, 100% {
    box-shadow: 0 0;
    height: 4em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 5em;
  }
} 
</style>
  
