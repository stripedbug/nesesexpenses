<template>
<div class="grid">

<div class="col-10 md:col-11"><h2 class="text-primary font-bold mt-1">Profile</h2></div>
<div class="col-2 md:col-1 pt-3"><i v-tooltip.bottom="'Set your password and email.'" class="pi pi-question-circle" style="font-size: 1.5rem"></i></div>


<div class="col-12">
<InputText type="text" v-model="email" class="w-full p-inputtext-sm" placeholder="New Expense Description" @keyup.enter="submit" />
</div>

<div class="col-12">
<InputText type="password" v-model="password" class="w-full p-inputtext-sm" placeholder="Password"  @keyup.enter="submit" ref="password"/>
</div>

<div class="col-12">
<InputText type="password" v-model="repassword" class="w-full p-inputtext-sm" placeholder="Password"  @keyup.enter="submit" ref="password"/>
</div>

</div>	
</template>

<script>
export default {

  name: 'Profile',

  data () {
    return {
    	email:null,
    	password:null,
    	repassword:null,
    }
  },
  mounted()
  {
  	//this.$store.dispatch('SetAppInitiated',true) 
  	//console.log(this.$store.state.user.email)
  	//this.email = this.$store.state.user.email
  },
  methods:{
  	async submit()
  	{
  		console.log("submit")
  		if(this.email && this.password && !this.repassword)
  		{
  			console.log("con 1")
  			return false
  		}
  		if(this.email && !this.password && !this.repassword)
  		{
  			console.log("con 2")
  			this.update({email:this.email})
  		}
  		if(this.email && this.password && this.repassword)
  		{
  			console.log("con 3")
  			if(this.password !== this.repassword)
  			{
  				console.log("con 4")
  				return false
  			}
  			else
  			{
  				this.update({email:this.email,password:this.password})
  			}
  			
  		}
  		
  	},
  	async update(data)
  	{
  		console.log(data)
  		let test = await this.updateProfile(data)
  		console.log(test)
  	}
  },
}
</script>

<style lang="css" scoped>
</style>