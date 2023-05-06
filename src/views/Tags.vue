<template>

<div class="grid">
<div class="col-10 md:col-11"><h2 class="text-primary font-bold mt-1">Tags</h2></div>
<div class="col-2 md:col-1 pt-3"><i v-tooltip.bottom="'Tags are designed for grouping and easy filtering for expenses. Each expense may have one ore many tags.'" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>

<div class="col-10 md:col-11 mb-3">
<InputText type="text" v-model="name" class="w-full p-inputtext-sm" placeholder="Add New Tag"  @keyup.enter="addNew"/>
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

  >
    <Column field="name" header="Name">
      <template #body="slotProps">
        <p class="editable_input" >
        {{slotProps.data.name}}
        </p>
        
      </template>
       <template #editor="{ data, field }">
        <InputText v-model="data[field]" autofocus class="w-full p-inputtext-sm  textinputarea" />
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

  name: 'Tags',

  data () {
    return {
      adding_new:false,
      name:null,
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
      
      
      let res = await this.updateItem("tags",data.id,data)
      await this.getCollections()
      this.showNotification("info","Item updated","")
    },
    async getCollections()
    {
     this.collections = await this.getFirebaseItems("tags")
     
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
                await this.deleteItem("tags",id)
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
        await this.addItem("tags",{name:this.name})       
        this.submitting = await false
        await this.getCollections()
        this.name = null
        this.showNotification("success","Item added","")
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>