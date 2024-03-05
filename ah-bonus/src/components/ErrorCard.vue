<template>
    <div class="card">
      <h1>Uh oh.</h1>
      <p> Er is iets fout gegaan.</p>
      <p class="error-status">Error code: {{ error.status }}</p>

    </div>
</template>
  
<script lang="ts">

  export default {
    props: {
      error: {
        type: Object,
        required: true,
        status: {
            type: String,
        },
        statusText: {
            type: String,
        }
      },
    },
    methods: {
  },
  async created() {
    console.log(this.error)
    },
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
    border-color: #f56f6e;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  color: #333;

}

p {
  font-size: 1rem;
  color: #888;
}
.error-status{
  padding-top:16px;
  color:#f56f6e;
}
</style>
  