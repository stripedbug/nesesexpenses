<template>
<div class="grid">

<div class="pageheader sticky col-12 top-0 z-5 p-2 text-white bg-indigo-500"><div class="grid">
<div class="col-10 md:col-11"><h1 class="font-bold m-0">Reports</h1></div>
<div class="col-2 md:col-1 pt-3"><i v-tooltip.bottom="'The items created on this page are actual expenses grouped by expendure items.'" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>
</div></div>

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
          <div>
          <span class="text-xl text-900 font-normal">Collection total: <b class="text-primary">{{getCollTotal(item)}}</b> </span>
        </div>
      </div>
  </template>
    <Column field="name" header="Name" style="width: 25%"></Column>
    <Column expander style="width: 5rem" />
    <Column v-for="column in item.columns" field="code" :header="column">
      <template #body="slotProps">
        {{showData(slotProps.data,column)}}
    </template>
    </Column>
    <template #expansion="slotProps">
      <div class="p-3 inner_table">
          <h3 class="text-gray-100 font-normal">All Expenses for <b>{{ slotProps.data.name }}</b></h3>
          <DataTable :value="slotProps.data.all_expenses" 
          paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
          sortMode="multiple"
          >
              <Column field="name" header="Name" sortable></Column>
              <Column field="price" header="Amount" sortable></Column>
              <Column field="date" header="Date" sortable>
                <template #body="slotProps">
                  {{ $filters.momentFormatSoft( slotProps.data.date.toDate(),"DD-MM-YYYY")}}
                </template>
              </Column>
              <Column field="tag"  header="Tags" sortable>
                <template #body="slotProps">
                  <p>          
                    <Tag  v-for="element in slotProps.data.tag" class="mr-2">
                      <p class="mt-0 mb-0">{{getTagItem(element)}}</p>

                    </Tag>        
                  </p>        
                </template>
              </Column>

              <Column field="file" header="Invoice" sortable>
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
    getCollTotal(collection)
    {
      
      let the_total_item = collection.expenseitems.find((item)=>{return item.name=="total"})
      if(the_total_item)
      {
        let the_total = 0
        for(let element of the_total_item.total)
        {
          the_total += element.total
        }
        return the_total
      }
      return 0
    },
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
      
      if(item.type=="montly_data")
      {
        let relevant_arr = item.expenses[column]
        if(relevant_arr && relevant_arr.length)
        {
          let expenses = relevant_arr.filter((item)=>{return item.the_month == column})
          let amount = 0
          expenses.forEach((item)=>{amount+=item.price})
          return this.$filters.numberformat(amount)
        }
      }
      if(item.type=="tally_data")
      {
        
        let totals = item.total.filter((element)=>{return element.id == column})
        let the_total = 0
        for(let total of totals)
        {
          the_total += total.total
        }

        return the_total

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
          columns:[],
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
            type:"montly_data",
          } 


          let item_expenses = this.expenses.filter((item)=>{return item.expenseitem == col_expense_item.id})
          col_expense_item_obj.all_expenses = item_expenses
          let item_expenses_by_month = this.groupByMonths(item_expenses,"the_month")
          col_expense_item_obj.expenses = item_expenses_by_month
          collection_obj.expenseitems.push(col_expense_item_obj)

          //calculate columns    
          let diff =0  
          let start
          let end

          
          if(item_expenses.length)
          {      
            start = item_expenses[0].date.toDate()
            end = item_expenses[item_expenses.length-1].date.toDate()    
            diff = this.monthDiff(start,end) 

            if(diff===0)
            {
              console.log("only one")
              let month_name = moment(start).startOf('month').format('MM-YYYY')
              console.log(month_name)
              let month_ind = collection_obj.columns.findIndex((item)=>{return item == month_name})
              if(month_ind==-1)
              {
                collection_obj.columns.push(month_name)
              }
              
            }
            else
            {
              console.log("not only one")
              let counter = 0
              while(diff+1>counter)
              {
                let month_name = moment(start).startOf('month').add(counter, 'M').format('MM-YYYY')
                let month_ind = collection_obj.columns.findIndex((item)=>{return item == month_name})
                if(month_ind==-1)
                {
                  collection_obj.columns.push(month_name)
                }
                counter++
              }              
            }
          }
          
          //calculate columns
        }
        //loop expenses_items

        let col_tally_expense_item_obj = {
            name:"total",
            id:collection.id,
            expenses:[],
            all_expenses:[],
            months:[],
            total:[],
            start_date:null,
            end_date:null,
            type:"tally_data",
          } 

          for(let the_col of  collection_obj.columns)
          {

            for(let the_exp_item of collection_obj.expenseitems)
            {
              
              
              let tally_obj = {
                  id:the_col,
                  total:0,
                }
              if(the_exp_item.expenses[the_col])
              {
                
                for(let the_exp of the_exp_item.expenses[the_col])
                {
                  
                  tally_obj.total += the_exp.price
                }

              }
              col_tally_expense_item_obj.total.push(tally_obj)
            }
          }

          collection_obj.expenseitems.push(col_tally_expense_item_obj)




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