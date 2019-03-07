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
  import axios from 'axios'
  import Pusher from 'pusher-js'
  import LineChart from '@/components/LineChart'

  const socket = new Pusher('0dc58685cd98594ff213', {
    cluster: 'ap2',
    encrypted: true
  })
  const channel = socket.subscribe('finance')

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
    created () {
      this.fetchData()
      this.fillData()
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        axios.get('/finances')
          .then(response => {
            let results = response.data.tempData
            let xLabel = results.map(a => a.index)
            let yLabel = results.map(a => a.value)
            this.xLabel = xLabel
            this.yLabel = yLabel
            results.map((tempRes) => {
              setInterval((tempRes) => {
                this.datacollection = {
                  labels: tempRes.index,
                  datasets: [
                    {
                      label: 'Generated Value',
                      backgroundColor: '#f87979',
                      data: tempRes.value
                    }
                  ]
                }
              }, 20000)
            })
            this.datacollection = {
              labels: this.xLabel,
              datasets: [
                {
                  label: 'Generated Value',
                  backgroundColor: '#f87979',
                  data: this.yLabel
                }
              ]
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      addDetails () {
        let startPoint = this.startVal
        let endPoint = this.endVal
        let incrementValue = this.increment
        axios.post('/expense/add', {
          start: startPoint,
          end: endPoint,
          gradient: incrementValue
        })
          .then(response => {
            this.startVal = ''
            this.endVal = ''
            this.increment = ''
            channel.bind('new-expense', function (data) {
              let results = response.data.tempData
              let xLabel = results.map(a => a.index)
              let yLabel = results.map(a => a.value)
              this.xLabel = xLabel
              this.yLabel = yLabel
              this.datacollection = {
                labels: this.xLabel,
                datasets: [
                  {
                    label: 'Generated Value',
                    backgroundColor: 'transparent',
                    pointBorderColor: '#f87979',
                    data: this.yLabel
                  }
                ]
              }
            })
          })
          .catch(error => {
            console.log(error)
          })
      },

      fetchData () {
        channel.bind('new-expense', resData => {
          let results = resData.data.tempData
          let xLabel = results.map(a => a.index)
          let yLabel = results.map(a => a.value)
          this.xLabel = xLabel
          this.yLabel = yLabel
          this.datacollection = {
            labels: this.xLabel,
            datasets: [
              {
                label: 'Generated Value',
                backgroundColor: '#f87979',
                data: this.yLabel
              }
            ]
          }
        })
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
