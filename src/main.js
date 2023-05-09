import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'


import "primevue/resources/primevue.min.css"
import "primevue/resources/themes/lara-light-indigo/theme.css"; 
import "primeicons/primeicons.css"                     
import "primeflex/primeflex.css"  
import "./assets/style.css" 

import InputText from 'primevue/inputtext';
import TabMenu from 'primevue/tabmenu';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import ConfirmDialog from 'primevue/confirmdialog';
import ConfirmationService from 'primevue/confirmationservice';
import FrameOverlay from "./components/FrameOverlay"
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import {frebaseutils} from "./frebaseutils"
import Dropdown from 'primevue/dropdown';
import Dialog from 'primevue/dialog';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row'; 
import Tooltip from 'primevue/tooltip';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import FileUpload from 'primevue/fileupload';
import Tag from 'primevue/tag';
import InputNumber from 'primevue/inputnumber';
import ColorPicker from 'primevue/colorpicker';
import Card from 'primevue/card';

import moment from "moment"

import VueClickAway from "vue3-click-away";
//createApp(App).use(store).use(router).mount('#app')

const app = createApp(App);

app.use(PrimeVue);
app.use(store);
app.use(router);
app.use(ConfirmationService);
app.use(ToastService);
app.use(VueClickAway)
app.mixin(frebaseutils);
app.directive('tooltip', Tooltip);

app.component('InputText', InputText);
app.component('TabMenu', TabMenu);
app.component('Button', Button);
app.component('ProgressSpinner', ProgressSpinner);
app.component('FrameOverlay', FrameOverlay);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Password', Password);
app.component('Toast', Toast);
app.component('Dropdown', Dropdown);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.component('Calendar', Calendar);
app.component('MultiSelect', MultiSelect);
app.component('FileUpload', FileUpload);
app.component('Tag', Tag);
app.component('InputNumber', InputNumber);
app.component('ColorPicker', ColorPicker);
app.component('Card', Card);

app.config.globalProperties.$filters = {
	momentFormat: function (value,format) {
    if (!value) return ''
      let item = value.toDate()
      let date = moment(item).format(format);
        return date
    },

    momentFormatSoft: function (value,format) {
    if (!value) return ''
      //let item = value.toDate()
      let date = moment(value).format(format);
        return date
    },

  	numberformat: function (value) {
      if (value || value ===0)
      {
        let number = value.toLocaleString('tr-TR', { maximumFractionDigits: 10 });
        return number
      }
      else
      {
        return ""
      }        
    },

}

app.mount('#app')