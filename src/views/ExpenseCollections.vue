<template>

<div class="grid">

<div class="pageheader sticky col-12 top-0 z-5 p-2 text-white bg-indigo-500"><div class="grid">
<div class="col-10 md:col-11"><h1 class="font-bold m-0">Expense Collections</h1></div>
<div class="col-2 md:col-1 pt-3"><i v-tooltip.bottom="'The items you add on this page are going to be used to create report pages. Every collection may have several expenditure items listed under the created collection.'" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>
</div></div>


<div class="col-9 md:col-10 mb-3">
<InputText type="text" v-model="name" class="w-full p-inputtext-sm" placeholder="Add New Collection"  @keyup.enter="addNew"/>
</div>

<div class="col-1 md:col-1 mb-3">

<ColorPicker v-model="color" format="hex"/>

</div>
<div class="col-2 md:col-1 mb-3">
<Button icon="pi pi-check" aria-label="Submit"  size="small" @click="addNew" :loading="submitting"/>
</div>
	





<template v-if="loading">
<div class="col-12 ">
<FrameOverlay></FrameOverlay>
</div>
</template>

<template v-else>
  <div class="col-12">
  <DataTable :value="collections"  
  class="p-datatable-sm" 
  stripedRows
  editMode="cell"
  @cell-edit-complete="onCellEditComplete" 
  tableClass="editable-cells-table"
  paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
  sortMode="multiple"
  >
    <Column field="name" header="Name">
      <template #body="slotProps">
        <p class="editable_input">
        {{slotProps.data.name}}
        </p>
        
      </template>

      <template #editor="{ data, field }">
        <InputText v-model="data[field]" autofocus class="w-full p-inputtext-sm  textinputarea" />
      </template>

    </Column>

    <Column field="color" header="Color">
      <template #body="slotProps">
        <p class="editable_input">
        <div class="color_area" :style="'background-color:#'+slotProps.data.color"></div>
        </p>
        
      </template>

      <template #editor="{ data, field }">
        <ColorPicker v-model="data[field]" format="hex"/>
      </template>

    </Column>


    <Column  headerStyle="width: 7rem; text-align: center" >
      <template #body="slotProps">
        <Button icon="pi pi-trash" class="mt-1" aria-label="Submit"  size="small" severity="danger" @click="deleteCollection(slotProps.data.id)" :loading="submitting"/>
      </template>
    </Column>

  </DataTable>
</div>







</template>






</div>


</template>

<script>
export default {

  name: 'ExpenseCollections',

  data () {
    return {
    	adding_new:false,
    	name:null,
      color:"3B82F6",
    	loading:true,
    	submitting:false,
    	collections:[],
    	editingitem:null,
    }
  },
  async mounted()
  {
  	 this.getCollections()
  	 this.loading = false
  },
  methods:{
    onCellEditComplete(event)
    {
      console.log(event)
      let newData = event.newData
      delete newData.undefined
      let ind = this.collections.findIndex((item)=>{return item.id == newData.id})
      this.collections[ind] = newData
      this.updateCollection(event.newData)
    },
  	editItem(id)
  	{
  		this.collections.forEach((item)=>{item.editing = false})
      let collections = this.sanitizeArray(this.collections)
  		let ind = collections.findIndex((item)=>{return item.id == id})
  		this.collections[ind].editing = true
  		this.editingitem = collections[ind]
  		setTimeout(()=>{
  			this.$refs["input_"+id].focus()
  		})
  		
  	},
  	async updateCollection(data)
  	{
  		
  		
      let res = await this.updateItem("expensecollections",data.id,data)
      await this.getCollections()
      this.showNotification("info","Item updated","")
  	},
  	async getCollections()
  	{
  	 this.collections = await this.getFirebaseItems("expensecollections")
     console.log(this.collections)
  	},
  	deleteCollection(id)
  	{
  		this.$confirm.require({
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
            	this.submitting = await true
                await this.deleteItem("expensecollections",id)
                await this.getCollections()
                this.submitting = await false
                this.showNotification("error","Item deleted","")
            },
            reject: () => {
                
            }
        });
  	},
  	async addNew()
  	{
  		if(this.name || this.name !=="")
  		{
  			this.submitting = await true
  			await this.addItem("expensecollections",{name:this.name,color:this.color}) 			
  			this.submitting = await false
  			await this.getCollections()
        this.name = null
        this.color = "3B82F6"
        this.showNotification("success","Item added","")
  		}
  	},
  }
}
</script>

<style lang="css" scoped>
  .color_area{
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }
</style>