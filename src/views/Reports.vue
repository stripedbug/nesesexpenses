<template>
<div class="grid">

<div class="col-10 md:col-11"><h2 class="text-primary font-bold mt-1">Reports</h2></div>
<div class="col-2 md:col-1 pt-3"><i v-tooltip.bottom="'The items created on this page are actual expenses grouped by expendure items.'" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>

<template v-if="loading">
<div class="col-12 ">
<FrameOverlay></FrameOverlay>
</div>
</template>

<template v-else>

<div class="col-12 mb-6" v-for="item in datatableitems" >
<DataTable  tableStyle="min-width: 50rem" :value="item.expenseitems" v-model:expandedRows="expandedRows" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse">
   <template #header>
      <div class="flex flex-wrap align-items-center justify-content-between gap-2">
          <span class="text-xl text-900 font-bold">{{item.name}}</span>
      </div>
  </template>
    <Column field="name" header="Name" style="width: 25%"></Column>
    <Column expander style="width: 5rem" />
    <Column v-for="column in columns" field="code" :header="column">
      <template #body="slotProps">
        {{showData(slotProps.data,column)}}
    </template>
    </Column>
    <template #expansion="slotProps">
      <div class="p-3 inner_table">
          <h3 class="text-gray-100 font-normal">All Expenses for <b>{{ slotProps.data.name }}</b></h3>
          <DataTable :value="slotProps.data.all_expenses" >
              <Column field="name" header="Name" sortable></Column>
              <Column field="price" header="Amount" sortable></Column>
              <Column field="date" header="Date" sortable>
                <template #body="slotProps">
                  {{ $filters.momentFormatSoft( slotProps.data.date.toDate(),"DD-MM-YYYY")}}
                </template>
              </Column>
              <Column field="tag"  header="Tags" >
                <template #body="slotProps">
                  <p>          
                    <Tag  v-for="element in slotProps.data.tag" class="mr-2">
                      <p class="mt-0 mb-0">{{getTagItem(element)}}</p>

                    </Tag>        
                  </p>        
                </template>
              </Column>

              <Column field="file" header="Invoice" >
                <template #body="slotProps">
                  <template v-if="slotProps.data.file">
                    <Button icon="pi pi-eye" label="Show " class="  p-button-sm"   @click="showDialog(slotProps.data)" />
                  </template>
                  <template v-else>
                      <p class="text-red-500 " >No Invoice</p> 
                  </template>
                </template>
              </Column>




          </DataTable>
      </div>
    </template>


</DataTable>

</div>

</template>


</div>
</template>

<script>
import moment from "moment"
export default {

  name: 'Reports',

  data () {
    return {
      collections:[],
      expenseitems:[],
      expenses:[],
      months:[],
      columns:[],
      datatableitems:[],
      loading:true,
      expandedRows: [],
      tags:[],

    }
  },
  async mounted()
  {
    this.collections = await this.getFirebaseItems("expensecollections")
    this.expenseitems = await  this.getFirebaseItemsOrdered("expenseitems","order")
    this.expenses = await this.getFirebaseItemsOrdered("expenses","date")
    this.tags = await this.getFirebaseItems("tags")
    await this.$store.dispatch('SetAppInitiated',true) 
    await console.log(this.expenses);
    await this.createReports()
  },
  methods:{
    async showDialog(item)
    {
      //this.invoive_popup_visibility = true
      //this.selected_expense = item
      let ddd = await this.getDownloadUrl(item.id)
      console.log(ddd);

      let url = 'https://firebasestorage.googleapis.com/v0/b/nesesexpenses.appspot.com/o/'+item.file+'?alt=media'
      console.log(url);
      const a = document.createElement('a')
      a.href = url
      a.download = url.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    getTagItem(id)
    {      
      let tag = this.tags.find((item)=>{return item.id == id})      
      return tag.name
    },
    onRowExpand(event)
    {
        console.log(event)
    },
    onRowCollapse(event)
    {
        console.log(event)
    },
    showData(item,column)
    {
      let relevant_arr = item.expenses[column]
      if(relevant_arr && relevant_arr.length)
      {
        let expenses = relevant_arr.filter((item)=>{return item.the_month == column})
        let amount = 0
        expenses.forEach((item)=>{amount+=item.price})
        return this.$filters.numberformat(amount)
      }
      return 0
     
    },
    getExpenseItemObj(coll_item)
    {
      
    },
    groupByMonths(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    monthDiff(dateFrom, dateTo) {
     return dateTo.getMonth() - dateFrom.getMonth() + 
       (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    },
    async createReports()
    {
      let reports = []
      if(!this.expenses.length)
      {
        this.loading = false
        return false
      }
      let start = this.expenses[0].date.toDate()
      let end = this.expenses[this.expenses.length-1].date.toDate()

      let diff = this.monthDiff(start,end)
      console.log(diff)
      let counter = 0
      while(diff+1>counter)
      {
        let month_name = moment(start).startOf('month').add(counter, 'M').format('MM-YYYY')
        this.columns.push(month_name)
        counter++
      }

      
      for(let item of this.expenses)
      {
        item.the_month = moment(item.date.toDate()).startOf('month').format('MM-YYYY')
        item.only_month = moment(item.date.toDate()).startOf('month').format('MM')
      }
      console.log(this.expenses)
      let expenses = this.sanitizeArray(this.expenses)
      expenses = this.groupByMonths(expenses,"the_month")
      console.log(expenses)

      //loop collections
      for(let collection of this.collections)
      {
        let collection_obj = {
          name:collection.name,
          id:collection.id,
          expenseitems:[],
          total:0,
          start_date:null,
          end_date:null,
        }


        let col_expense_items = this.expenseitems.filter((item)=>{return item.collection == collection.id})
        //loop expenses_items
        for(let col_expense_item of col_expense_items)
        {
          let col_expense_item_obj = {
            name:col_expense_item.name,
            id:col_expense_item.id,
            expenses:[],
            all_expenses:[],
            months:[],
            total:0,
            start_date:null,
            end_date:null,
          } 


          let item_expenses = this.expenses.filter((item)=>{return item.expenseitem == col_expense_item.id})
          col_expense_item_obj.all_expenses = item_expenses
          let item_expenses_by_month = this.groupByMonths(item_expenses,"the_month")
          col_expense_item_obj.expenses = item_expenses_by_month
          collection_obj.expenseitems.push(col_expense_item_obj)
          //loop expenses
          
          //loop expenses
        }
        //loop expenses_items
        this.datatableitems.push(collection_obj)
      }
      //loop collections
      console.log(this.datatableitems);
      this.loading = false

    },
  },
}
</script>

<style lang="css" scoped>
  .inner_table{
    background: #ec4899;
  }
</style>