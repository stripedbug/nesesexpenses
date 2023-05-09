<template>

<div class="grid">

<div class="pageheader sticky col-12 top-0 z-5 p-2 text-white bg-indigo-500"><div class="grid">
<div class="col-10 md:col-11"><h1 class=" font-bold m-0">Expenses</h1></div>
<div class="col-2 md:col-1 pt-3"><i v-tooltip.bottom="'The items created on this page are actual expenses grouped by expendure items.'" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>
</div></div>



<div class="col-6 md:col-8 mb-3">
<InputText type="text" v-model="name" class="w-full p-inputtext-sm" placeholder="New Expense Description" />
</div>

<div class="col-6 md:col-4 mb-3">
<InputNumber  v-model="price" class="w-full p-inputtext-sm" placeholder="Expense Amount" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="8" />
</div>

<div class="col-6 md:col-3 mb-3">
<Dropdown v-model="expenseitem" :options="expenseitems" optionLabel="name" optionValue="id" placeholder="Select Expenditure Item" class="w-full p-inputtext-sm" />
</div>

<div class="col-6 md:col-3 mb-3">
<Calendar v-model="date"  class="w-full p-inputtext-sm" placeholder="Select Expense Date" dateFormat="dd-mm-YYYY"/>
</div>

<div class="col-6 md:col-3 mb-3">
<MultiSelect v-model="tag" :options="tags" optionLabel="name" optionValue="id" placeholder="Select Tags" class="w-full p-inputtext-sm" display="chip" />
</div>

<div class="col-6 md:col-2 mb-3">
<div class="flex align-items-center justify-content-center ">
<FileUpload mode="basic" name="demo[]"  chooseLabel="Invoice" :maxFileSize="10000000000" @upload="onUpload" @select="uploadFile" />
</div>
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
  tableStyle="min-width: 50rem" 
  class="p-datatable-sm" 
  stripedRows
  editMode="cell"
  @cell-edit-complete="onCellEditComplete" 
  tableClass="editable-cells-table"
  paginator :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
  sortMode="multiple"
  >

    <Column field="name" header="Name" sortable headerStyle="width: 25rem">
      <template #body="slotProps">
        <p class="editable_input" >
        {{slotProps.data.name}}
        </p>        
      </template>
      <template #editor="{ data, field }">
        <InputText v-model="data[field]" autofocus class="w-full p-inputtext-sm  textinputarea" />
      </template>
    </Column>

    <Column field="price" header="Amount" sortable>
      <template #body="slotProps">
        <p class="editable_input" >
        {{ $filters.numberformat( slotProps.data.price," DD-MM-YYYY")}}
        </p>        
      </template>
      <template #editor="{ data, field }">
        <InputNumber v-model="data[field]" autofocus class="w-full p-inputtext-sm  textinputarea" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5"/>
      </template>
    </Column>

    <Column field="expenseitem"  header="Expenditure Item" sortable>
      <template #body="slotProps">
        <p class="editable_input" >
        {{showCollection(slotProps.data.expenseitem)}}
        </p>       
      </template>

      <template #editor="{ data, field }">
         <Dropdown  v-model="data[field]" :options="expenseitems" optionLabel="name" optionValue="id" placeholder="Select an Expense Item" class="w-full p-inputtext-sm " />
      </template>

    </Column>

    <Column field="date"  header="Date" sortable>
      <template #body="slotProps">
        <p class="editable_input">
        {{ $filters.momentFormatSoft( slotProps.data.date,"DD-MM-YYYY")}}
        </p>
        
      </template>

      <template #editor="{ data, field }">
         <Calendar v-model="data[field]"  class="w-full p-inputtext-sm"  dateFormat="dd-mm-YYYY"/>
      </template>
    </Column>

    <Column field="tag"  header="Tags" headerStyle="width: 15rem; text-align: center" sortable>
      <template #body="slotProps">
        <p class="editable_input" >          
          <Tag  v-for="element in slotProps.data.tag" class="mr-2 mb-2">
            <p class="mt-0 mb-0">{{getTagItem(element)}}</p>

          </Tag>        
        </p>        
      </template>

      <template #editor="{ data, field }">
         <MultiSelect  v-model="data[field]" :options="tags" optionLabel="name" optionValue="id" placeholder="Select Tags" class="w-full p-inputtext-sm" display="chip" />
      </template>
    </Column>

    <Column field="file" header="Invoice" sortable>
      <template #body="slotProps">

        <template v-if="slotProps.data.file">
          <div class="justify-content-start flex">
          <Button icon="pi pi-eye" label="Show " class="hide_on_mobile  p-button-sm"   @click="showDialog(slotProps.data)" :loading="submitting"/>
          <Button icon="pi pi-trash" label="Remove" class="hide_on_mobile  p-button-sm ml-2"   severity="danger" @click="removeInvoice(slotProps.data)" :loading="submitting"/>

           <Button icon="pi pi-eye"  class="show_on_mobile  p-button-sm"   @click="showDialog(slotProps.data)" :loading="submitting"/>
          <Button icon="pi pi-trash"  class="show_on_mobile  p-button-sm ml-2"   severity="danger" @click="removeInvoice(slotProps.data)" :loading="submitting"/>
        </div>
        </template>
        <template v-else>
          <template v-if="slotProps.data.edit_invoice">
            <div class="justify-content-start flex">
              <div class="hide_on_mobile ">
             <FileUpload mode="basic" name="demo[]"  chooseLabel="Upload" :maxFileSize="10000000000" @upload="onUploadForExisting($event,slotProps.data)"  :auto="true" customUpload @uploader="onUploadForExisting($event,slotProps.data)" />
           </div>

           <div class="show_on_mobile ">
             <FileUpload mode="basic" name="demo[]"  chooseLabel=" " :maxFileSize="10000000000" @upload="onUploadForExisting($event,slotProps.data)"  :auto="true" customUpload @uploader="onUploadForExisting($event,slotProps.data)" />
           </div>


             
              <Button icon="pi pi-times"  aria-label="Cancel"  label="Cancel"  size="small" @click="cancelEditInvoice" severity="danger" class="hide_on_mobile ml-2  p-button-sm"/>
              <Button icon="pi pi-times"  aria-label="Cancel"    size="small" @click="cancelEditInvoice" severity="danger" class="show_on_mobile ml-2  p-button-sm"/>
            </div>
          </template>
          <template v-else>
            <p class="text-red-500 editable_input" @click="editInvoice(slotProps.data)">No Invoice</p>
          </template>
          
        </template>
               
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


<Dialog v-model:visible="invoive_popup_visibility" modal header="Invoice" :style="{ width: '90vw' }">
  <div class="grid "><div class="col-12 show_img mb-6">
<img :src="'https://firebasestorage.googleapis.com/v0/b/nesesexpenses.appspot.com/o/'+selected_expense.file+'?alt=media'"   />
</div></div>


<template #footer>
  <br/><br/>
  <Button label="Change" icon="pi pi-pencil" @click="invoive_popup_visibility = false" severity="info" />
  <Button label="Delete" icon="pi pi-trash" @click="invoive_popup_visibility = false" severity="danger" />
  <Button label="Download" icon="pi pi-download" @click="invoive_popup_visibility = false" severity="primary" />
  <Button label="Close" icon="pi pi-check" @click="invoive_popup_visibility = false" severity="danger" />
</template>

</Dialog>



</div>


</template>
<script>
export default {

  name: '"Expenses"',

  data () {
    return {
        adding_new:false,
        name:null,
        price:null,
        items:[],
        expenseitem:null,
        date:null,
        tag:null,
        tags:[],
        loading:true,
        submitting:false,
        expenseitems:[],
        editingitem:null,
        selectedfileid:null,
        invoive_popup_visibility:false,
        selected_expense:null,
    }
  },
  async mounted()
  {
    this.expenseitems = await this.getFirebaseItemsOrdered("expenseitems","order")
    this.tags = await this.getFirebaseItems("tags")
     this.getItems()
     this.loading = false
  },
  methods:{
    editInvoice(data)
    {
      this.items.forEach((item)=>{item.edit_invoice = false})
      let ind = this.items.findIndex((item)=>{return item.id == data.id})
      this.items[ind].edit_invoice = true
    },
    cancelEditInvoice()
    {
      this.items.forEach((item)=>{item.edit_invoice = false})
    },
    async onUploadForExisting(event,data)
    {
      console.log("onUploadForExisting")
      console.log(event)
      console.log(data)
      let file_id = await this.uploadFileToStorage(event.files[0])
      let ind = this.items.findIndex((item)=>{return item.id == data.id})
      this.items[ind].file = file_id
      this.updateCollection(this.items[ind])
    },
    async removeInvoice(data)
    {
      
      

      this.$confirm.require({
            message: 'Are you sure you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                this.submitting = await true
                delete data.file
                this.updateCollection(data)
                this.submitting = await false
            },
            reject: () => {
                
            }
        });
    },
    downloadImage(url) {
      fetch(url, {
        mode : 'no-cors',
      })
        .then(response => response.blob())
        .then(blob => {
        let blobUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.download = url.replace(/^.*[\\\/]/, '');
        a.href = blobUrl;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
    },
    async showDialog(item)
    {
      //this.invoive_popup_visibility = true
      //this.selected_expense = item
      let ddd = await this.getDownloadUrl(item.id)
      console.log(ddd);

      let url = 'https://firebasestorage.googleapis.com/v0/b/nesesexpenses.appspot.com/o/'+item.file

      
      console.log(url);
      const a = document.createElement('a')
      a.href = url
      a.download = url.split('/').pop()
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    hideDialog()
    {
      this.invoive_popup_visibility = false
      this.selected_expense = null
    },
    getTagItem(id)
    {      
      let tag = this.tags.find((item)=>{return item.id == id})      
      return tag.name
    },
    async uploadFile(data)
    {
      console.log(data)
      let file_id = await this.uploadFileToStorage(data.files[0])
      console.log(file_id)
      this.selectedfileid = file_id
    },
    onCellEditComplete(event)
    {
      console.log("onCellEditComplete")
      console.log(event)
      let newData = event.newData
      delete newData.undefined
      let ind = this.items.findIndex((item)=>{return item.id == newData.id})
      this.items[ind] = newData
      this.updateCollection(event.newData)
    },
    onUpload()
    {
      this.selectedfileid = null
    },
    showCollection(id)
    {
      console.log("showCollection")
      let coll = this.expenseitems.find((item)=>{return item.id == id})
      if(coll)
      {
        return coll.name
      }
      return null
    },
    editItem(id,type,slotProps)
    {
      console.log(slotProps)
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
      
      let res = await this.updateItem("expenses",data.id,data)
      await this.getItems()
      this.showNotification("info","Item updated","")
    },
    async getItems()
    {
     let items = await this.getFirebaseItems("expenses")
     for(let item of items)
     {
      item.edit_invoice = false
      item.date = item.date.toDate()
     }
     this.items = items
     console.log(this.items)
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
                await this.deleteItem("expenses",id)
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
      
      
      if(!this.name || this.name =="")
      {
        return false
      }
      if(!this.expenseitem || this.expenseitem =="")
      {
        return false
      }

      if(!this.date || this.date =="")
      {
        return false
      }
      if(!this.price || this.price =="")
      {
        return false
      }
        
        let order = this.items.length
        this.submitting = await true
        await this.addItem("expenses",{
          name:this.name,
          expenseitem:this.expenseitem,
          date:this.date,
          price:this.price,
          tag:this.tag,
          file:this.selectedfileid,
        })       
        this.submitting = await false
        await this.getItems()
        this.name = null
        this.expenseitem = null
        this.expenseitem = null
        this.date = null
        this.price = null
        this.tag = null
        this.selectedfileid = null
        this.showNotification("success","Item added","")
     
    },
  }
}
</script>

<style lang="css" scoped>
  .show_img img{
    width: 100%;
  }
</style>