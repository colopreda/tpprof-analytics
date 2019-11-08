<template>
    <div>
        <h2>Home</h2>
        <div class="row">
            <div class="col-lg-6">
                <TableChart :title="trip_list.title" :dataUrl="trip_list.dataUrl" :data="trip_list.data" :tooltipText="trip_list.tooltipText"></TableChart>
            </div>
        </div>
    </div>
</template>

<script>
// Imports de constantes
import * as consts from '@/common/config.js'

// Imports de graficos
import TableChart from "../components/charts/TableChart";

export default {
    name: 'home',
    components: {
        TableChart
    },
    data() {
      return {
          trip_list: consts.TRIP_LIST
      }
    }
}

</script>

<style>
h2 {
    margin-top: 20px!important;
}
</style>
