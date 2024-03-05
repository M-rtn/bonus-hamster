<template>
    <div class="card" v-bind:style="style(currentCard.type)">
        <div class="card-content">
            <div class="image-container">
                <img :src="promotion.image" class="card-image" />
                <div v-if="promotion.discountLabel" class="promotion-shield">
                    <div class="top-section">
                        BONUS BOX
                    </div>
                    <div class="bottom-section">
                        {{ promotion.discountLabel }}
                    </div>
                </div>
            </div>
            <div class="text-container">
                <h3 class="card-title">{{ promotion.segmentDescription }}</h3>
                <h4 class="card-subtitle">{{ promotion.salesUnitSize }}</h4>
                <p>{{ promotion.bonusPeriodDescription }}</p>
                </div>
            <div class="action-container">
                <button v-if="promotion.activationStatus === 'ACTIVATABLE'" class="action-button"
                    @click="setPromotion(promotion.offerId, promotion.segmentId, promotion.offerStartDate)">Activate</button>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">


export default {
    props: {
        promotion: {
            type: Object,
            required: true,
        },
        currentCard: {
            type: Object,
            required: true,
        },
    },
    methods: {
        async setPromotion(offerId: number, segmentId: number, offerStartDate: string) {
            try {
                const body = {
                    offerId: offerId,
                    segmentId: segmentId,
                    offerStartDate: offerStartDate,
                };
                const response = await fetch('/api/promotions/activate/' + this.currentCard.id, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(body)
                });
                if (response.ok) {
                    this.$emit("updatePromotion", offerId)
                }
            } catch (error) {
                console.error(error);
            }
        },
        style(type){
      switch(type) {
        case 'normal':
        return {
            borderColor: "#2196F3"
          }
        case 'premium':
          return {
            borderColor: "#c48c39"
          }
      }
    }
    },
   
    async created() {
    },
}
</script>

 
<style scoped>

.action-container{
    float:right;
    margin-right:16px;
}
.card {
    width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px auto;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
    width: 100%;
}

.image-container {
    height: 136px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-image {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.promotion-shield {
    position: absolute;
    bottom: 8px;
    left: 16px;
    border: 1px solid #ff7900;
    border-radius: 8px;
    text-align: center;

}

.top-section {
    background-color: white;
    color: #ff7900;
    border-radius: 8px 8px 0 0;
    padding: 1px 2px;
    font-weight: 600;

}

.bottom-section {
    background-color: #ff7900;
    color: #fff;
    border-radius: 0 0 7px 7px;
    padding: 1px 2px;
    font-weight: 600;
    text-transform: uppercase;

}

.text-container {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    white-space: initial;

}

.card-title {
    color: #303030;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3em;
    min-height:2.6em;
    margin-bottom: 2px;
}

.card-subtitle {
    color: #acacac;
    font-size: 14px;
}

.card-content {
    color: #ff7900;
    font-size: 12px;
}

.action-button {
    margin-top: 16px;
    margin-bottom: 8px;
    padding: 8px 16px;
    background-color: #ff7900;
    color: #fff;
    border: none;
    border-radius: 50px;
}

.action-button:hover {
    background-color: #ffc999;
}

.action-button:focus {
    outline: none;
}

.action-button:active {
    background-color: #00418a;
}

.loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.loader-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}</style>
  
