<template>
<div class=" fullpage flex align-items-center justify-content-center thebg">
<div class="flex align-items-center justify-content-center container_area">
<div class="grid">
	<div class="col-12">
		<h2 class="text-purple-500 text-center">Neşe's Expenses</h2>
	</div>
<div class="col-12">
<InputText type="text" v-model="email" class="w-full p-inputtext-sm" placeholder="Email"  @keyup.enter="submit" ref="email"/>
</div>
<div class="col-12">
<InputText type="password" v-model="password" class="w-full p-inputtext-sm" placeholder="Password"  @keyup.enter="submit" ref="password"/>

</div>

<div class="col-12">
<div class="flex align-items-center justify-content-end mt-4">
	<Button icon="pi pi-lock" aria-label="Submit"  size="small" label="Login" severity="help"  :loading="submitting" @click="submit"/>
</div>
</div>

</div>
</div>
</div>
</template>

<script>
export default {

  name: 'Login',

  data () {
    return {
    	email:null,
    	password:null,
    	submitting:false,
    }
  },
  mounted()
  {
  	this.$store.dispatch('SetAppInitiated',true) 
  },
  methods:{
  	async submit()
  	{
  		if(!this.email)
  		{
  			this.$refs.email.focus()
  			return false
  		}

  		if(this.email && this.password)
  		{
  			this.submitting = true
  			this.login(this.email,this.password)
  			this.submitting = false
  		}
  		
  	},
  }
}
</script>

<style lang="css" scoped>
	.thebg{
		background: #ec4899;
	}
	.fullpage{
		width: 100%;
		height: 100vh;
	}
	.container_area{
		width: 30%;
		padding: 30px 10px;
		background: #fefefe;
		border-radius: 6px;
		border: 1px solid #ec4899;
	}
	@media only screen
and (max-width : 768px) {
.container_area{
		width: 90%;
	}
}
</style>