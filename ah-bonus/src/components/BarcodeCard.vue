<template>
<div class="wrapper">
  <div class="barcode" v-html="currentBarcode"></div>
</div>
</template>
  
<script lang="ts">

export default {

  props: {
    currentCard: {
      type: Object,
      required: true,
    },
    
  },
  data(){
    return{
      currentBarcode: ""
    }
  },
  methods: {
    generateEANCode(cardID) {
      var arrayCodeEANBin, arrayStructEAN;
      arrayCodeEANBin = [['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'], ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'], ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100']];
      arrayStructEAN = ['000000', '001011', '001101', '001110', '010011', '011001', '011100', '010101', '010110', '011010'];

      var strText = cardID.toString();
      var strRaw = "101";
      var strStruct = arrayStructEAN[strText[0]];

      // First six bar sequences
      for (var i = 1; i < 7; i += 1) {
        strRaw += arrayCodeEANBin[strStruct[i - 1]][strText[i]];
      }

      // Middle sequence
      strRaw += "01010";

      // Last six bar sequences (without check digit)
      for (var e = 0; e < 6; e += 1) {
        strRaw += arrayCodeEANBin[2][strText[e + 7]];
      }
      strRaw += "101";

      this.generateBarcode(strRaw);
    },
    generateBarcode(EANcode) {
      var array5bit_A = new Array('f//AAAAAAAAAAAAAAAAAAAA', 'f//AAAAAAAAAAAAAAAAAAAB', 'f//AAAAAAAAAAAAAAEAAAD/',
        'f//AAAAAAAAAAAAAAEAAAAA', 'f//AAAAAAAAAQAAAP8AAAAA', 'f//AAAAAAAAAQAAAP8AAAAB', 'f//AAAAAAAAAQAAAAAAAAD/',
        'f//AAAAAAAAAQAAAAAAAAAA', 'f//AAABAAAA/wAAAAAAAAAA', 'f//AAABAAAA/wAAAAAAAAAB', 'f//AAABAAAA/wAAAAEAAAD/',
        'f//AAABAAAA/wAAAAEAAAAA', 'f//AAABAAAAAAAAAP8AAAAA', 'f//AAABAAAAAAAAAP8AAAAB', 'f//AAABAAAAAAAAAAAAAAD/',
        'f//AAABAAAAAAAAAAAAAAAA', 'QD/AAD/AAAAAAAAAAAAAAAA', 'QD/AAD/AAAAAAAAAAAAAAAB', 'QD/AAD/AAAAAAAAAAEAAAD/',
        'QD/AAD/AAAAAAAAAAEAAAAA', 'QD/AAD/AAAAAQAAAP8AAAAA', 'QD/AAD/AAAAAQAAAP8AAAAB', 'QD/AAD/AAAAAQAAAAAAAAD/',
        'QD/AAD/AAAAAQAAAAAAAAAA', 'QD/AAAAAAAA/wAAAAAAAAAA', 'QD/AAAAAAAA/wAAAAAAAAAB', 'SL/AADeAAAA/gAAAAIAAAD+',
        'QD/AAAAAAAA/wAAAAEAAAAA', 'QD/AAAAAAAAAAAAAP8AAAAA', 'QD/AAAAAAAAAAAAAP8AAAAB', 'QD/AAAAAAAAAAAAAAAAAAD/',
        'QD/AAAAAAAAAAAAAAAAAAAA');
      var array5bit_B = new Array('US0CAuSD38g', 'UUYCA7QBErs', 'ajEDAm49ReY', 'UUoCA+juogg', 'bjEDAjQrOn0', 'bkoDA3iPVH4',
        'ajUDAt82atY', 'UU4CA1nljTg', 'cjEDAghkmFU', 'ckoDA0TA9lY', 'izUEAhrxcbg', 'ck4DAxY8F10', 'bjUDAlvFFR8', 'bk4DAxdhexw',
        'ajkDAr7LFAw', 'UVICAyQ+UJI', 'TTECAq7UnEM', 'TUoCA+Jw8kA', 'ZjUDAmZGozo', 'TU4CA7CME0s', 'ajUDAvnk9E4', 'ak4DA7VAmk0',
        'ZjkDAtle3bI', 'TVICAxOyzrM', 'STUCAqHeHtM', 'SU4CA+16cNA', 'h6QEAZKdo54', 'SVICA62zYxM', 'RTkCAqx1lb4', 'RVICA/z3WM0',
        'QT0CAkdoxRU', 'KFYBA46vJCA');

      var stringStart = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAACCAQAAADLaIVbAAAANUlEQVQIHQEqANX/A';
      var stringMid = 'AAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAA';
      var stringEnd = 'AAAAASUVORK5CYII=" width="';

      var intRawmod = EANcode.length % 5; // Modulo 5 remainder
      if (intRawmod > 0) for (var i = 0; i < 5 - intRawmod; i++) EANcode += "0"; // If not evenly divisible, pad with zeroes
      
      
  var intChunks = EANcode.length / 5; // Calculate the number of chunks

var arraySeq = new Array(intChunks); 

      for (var a = 0; a < intChunks; a++) arraySeq[a] = parseInt(EANcode.substr(a * 5, 5), 2); // Converts string of 1's and 0's to integer array

      // Takes integer array and converts to "<img ...>" graphics for display
      var resultString = "";
      for (var e = 0; e < arraySeq.length; e++) {
        resultString += stringStart + array5bit_A[arraySeq[e]] + stringMid + array5bit_B[arraySeq[e]] + stringEnd + 12 + '" height="' + 60 + '">';
      }
      this.currentBarcode = resultString;
      document.getElementById("barcode")?.innerHTML == resultString;
    }
},
watch: {
    currentCard: {
      immediate: true,
      handler() {
        if(this.currentCard?.id){
          this.generateEANCode(this.currentCard.id);
        }
      },
    },
  },
  async mounted() {
    this.generateEANCode(this.currentCard.id);
},
}

</script>

<style scoped>

.wrapper{
  padding: 16px;
  background-color: white;
  border-radius: 12px;
  width:260px;
}
.barcode {
  width:228px;
  height:60px;
}

.barcode img {
  max-width: 100%;
  height: auto;
}
</style>
  