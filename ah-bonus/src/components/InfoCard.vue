<template>
    <div v-if="!hideInfoCard" class="card">
      <h1>Koopzegels</h1>
      <p> Bij deze kaart zijn koopzegels actief.</p>
      <button @click="onClick()">Laat dit niet meer zien</button>
    </div>
</template>
  
<script lang="ts">

  export default {
    data() {
        return{
        hideInfoCard: false
        }
    },
    methods: {
        onClick(){
            localStorage.setItem("hideInfoCard","true");
            this.hideInfoCard = true;
        }
  },
  mounted(){
    this.hideInfoCard = Boolean(localStorage.getItem("hideInfoCard"));
  }
}
  </script>

<style scoped>

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
    border-color: #FFA726;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  color: #333;

}

p {
  font-size: 1rem;
  color: #888;
  text-align: center;

}

button{
    margin-top: 16px;
    margin-bottom: 8px;
    padding: 8px 16px;
    background-color: #ff7900;
    color: #fff;
    border: none;
    border-radius: 50px;
}
</style>
  