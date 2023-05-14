<template>

<div class="grid">

<div class="pageheader sticky col-12 top-0 z-5 p-2 text-white bg-indigo-500"><div class="grid">
<div class="col-10 md:col-11"><h1 class=" font-bold m-0">Expenditure Items</h1></div>
<div class="col-2 md:col-1 pt-3"><i v-tippy="{ content: 'The items created on this page will be used as branches for the collections. The expenses will be included under the items on this page. Items can be reordered by dragging.' }" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>
</div></div>

<div class="col-6 md:col-8 mb-3">
<InputText type="text" v-model="name" class="w-full p-inputtext-sm" placeholder="Add New Item"  @keyup.enter="addNew"/>
</div>

<div class="col-4 md:col-3 mb-3">
<Dropdown v-model="collection" :options="collections" optionLabel="name" optionValue="id" placeholder="Select a Collection" class="w-full p-inputtext-sm"  @change="addNew"/>

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
  <DataTable 
  :value="items" 
  class="p-datatable-sm" 
  stripedRows
  :reorderableColumns="true" 
  @rowReorder="onRowReorder"
  editMode="cell"
  @cell-edit-complete="onCellEditComplete" 
  tableClass="editable-cells-table"
  paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
  sortMode="multiple"
  >
  <Column rowReorder headerStyle="width: 3rem" :reorderableColumn="true" />
    <Column field="name" header="Name" headerStyle="width: 43%" >
      <template #body="slotProps">
        <p class="editable_input">
        {{slotProps.data.name}}
        </p>
        
      </template>

      <template #editor="{ data, field }">
        <InputText v-model="data[field]" autofocus class="w-full p-inputtext-sm  textinputarea" />
      </template>

    </Column>

    <Column field="collection"  header="Collection" headerStyle="width: 43%" >
      <template #body="slotProps">
        <p class="editable_input">
        {{showCollection(slotProps.data.collection)}}
        </p>
        
      </template>

      <template #editor="{ data, field }">
         <Dropdown  v-model="data[field]" :options="collections" optionLabel="name" optionValue="id" placeholder="Select a Collection" class="w-full p-inputtext-sm " />
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

  name: 'ExpenditureItems',

  data () {
    return {
        adding_new:false,
        name:null,
        items:[],
        collection:null,
        loading:true,
        submitting:false,
        collections:[],
        editingitem:null,
    }
  },
  async mounted()
  {
    this.collections = await this.getExpenseCollections()
     this.getItems()
     this.loading = false
  },
  methods:{
    onCellEditComplete(event)
    {
      console.log(event)
      let newData = event.newData
      delete newData.undefined
      let ind = this.items.findIndex((item)=>{return item.id == newData.id})
      this.items[ind] = newData
      this.updateCollection(event.newData)
    },
    async onRowReorder(data)
    {
      //console.log(data)
      //console.log(this.items)
      for (let i = 0; i < data.value.length; i++) {
        let res = await this.updateItem("expenseitems",data.value[i].id,{name:data.value[i].name,collection:data.value[i].collection,order:i})
                  
        }
         await this.getItems() 
        this.showNotification("info","Order updated","")
    },
    showCollection(id)
    {
      console.log("showCollection")
      let coll = this.collections.find((item)=>{return item.id == id})
      if(coll)
      {
        return coll.name
      }
      return null
    },
    editItem(id,type)
    {
      console.log(id)
      console.log(this.items)
      this.items.forEach((item)=>{item.editing = false})
      let items = this.sanitizeArray(this.items)
      let ind = items.findIndex((item)=>{return item.id == id})
      this.items[ind].editing = true
      this.editingitem = items[ind]
      setTimeout(()=>{
        if(type=="input")
        {
          this.$refs[type+id].focus()
        }
        
      })
      
    },
    async updateCollection(data)
    {
      
      let res = await this.updateItem("expenseitems",data.id,data)
      await this.getItems()
      this.showNotification("info","Item updated","")
    },
    async getItems()
    {
     this.items = await this.getFirebaseItemsOrdered("expenseitems","order")
    },
    deleteCollection(id)
    {
      console.log(id)
      this.$confirm.require({
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
              this.submitting = await true
                await this.deleteItem("expenseitems",id)
                await this.getItems()
                this.submitting = await false
                this.showNotification("error","Item deleted","")
            },
            reject: () => {
                
            }
        });
    },
    async addNew()
    {
      console.log(this.collection)
      if(!this.name || this.name =="")
      {
        return false
      }
      if(!this.collection || this.collection =="")
      {
        return false
      }
        
        
        let order = this.items.length
        this.submitting = await true
        await this.addItem("expenseitems",{name:this.name,collection:this.collection,order:order})       
        this.submitting = await false
        await this.getItems()
        this.name = null
        this.collection = null
        this.showNotification("success","Item added","")
     
    },
  }
}
</script>

<style lang="css" scoped>
</style>