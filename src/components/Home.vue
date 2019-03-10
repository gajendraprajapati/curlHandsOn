<template>
  <div class="hello">
    <div class="container">
      <div class="row">
        <line-chart :chart-data="datacollection"></line-chart>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <form class="form" @submit.prevent="addDetails">
          <h4>Add New Entry</h4>
          <div class="form-group">
            <label>Start Value</label>
            <input class="form-control" placeholder="Enter the Start Value" type="number" v-model="startVal" required>
          </div>
          <div class="form-group">
            <label>End Value</label>
            <input class="form-control" placeholder="Enter the End Value" type="number" v-model="endVal" required>
          </div>
          <div class="form-group">
            <label>Increment</label>
            <input class="form-control" placeholder="Enter the Increment" type="number" v-model="increment" required>
          </div>
          <div class="form-group">
            <button class="btn btn-primary">Add New Entry</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import LineChart from '@/components/LineChart'
  const url = 'ws://localhost:8880/echo'
  const w = new WebSocket(url)
  export default {
    name: 'home',
    components: {LineChart},
    data () {
      return {
        xLabel: null,
        yLabel: null,
        incrementValue: null,
        startVal: null,
        endVal: null,
        increment: null,
        datacollection: null,
        entrydate: null
      }
    },
    methods: {
      addDetails () {
        let startPoint = this.startVal
        let endPoint = this.endVal
        let incrementValue = this.increment
        // let s = startPoint.toString()+endPoint.toString()+
        // w.onmessage = () => {

        // }
        let cData = []
        w.send(startPoint.toString() + ',' + endPoint.toString() + ',' + incrementValue.toString())
        w.onmessage = (e) => {
          let rawData = e.data.split(',')
          rawData.map((t, index) => {
            cData.push({value: t,
              index: index})
          })
          let xLabel = cData.map(a => a.index)
          let yLabel = cData.map(a => a.value)
          this.datacollection = {
            labels: xLabel,
            datasets: [
              {
                label: 'Generated Value',
                backgroundColor: 'transparent',
                pointBorderColor: '#f87979',
                data: yLabel
              }
            ]
          }
        }
      }
    }
  }
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .title {
    text-align: center;
    margin-top: 40px;
  }
  .subtitle {
    text-align: center;
  }
  .form {
    max-width: 600px;
    width: 100%;
    margin: 20px auto 0 auto;
  }
  .form h4 {
    text-align: center;
    margin-bottom: 30px;
  }

  h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
