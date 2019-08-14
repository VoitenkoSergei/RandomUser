'use strict';
const content =  document.getElementById('root');
let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

table.classList.add('table');
thead.classList.add('thead-dark');

content.appendChild(table);
table.appendChild(thead);
table.appendChild(tbody);
thead.innerHTML = `<tr>
<th></th>
<th>Last</th>
<th>First</th>
<th>Username</th>
<th>Phone</th>
<th>Location</th>
<th></th>
</tr>`;

let xhr = new XMLHttpRequest();
xhr.addEventListener('readystatechange',()=>{
	if(xhr.readyState == 4){
		if(xhr.status == 200){
			let response = JSON.parse(xhr.responseText);
			const users = (response.results);
			let table = new Table(users);
			table.render();
			table.chart();
		}
	}
});
xhr.open('GET','https://randomuser.me/api/?results=15');
xhr.send();

let input = document.getElementById('search');
let collectionNames = document.getElementsByClassName('firstName');
input.addEventListener('keyup', function(event){
	let value = this.value;
	if(this.value=='') value=' ';
	if(this.value=='.') value = '\\'+this.value;
	if(this.value=='...') value = '\\.{3}';


	for(let i=0; i<collectionNames.length; i++){
		let reg = new RegExp(value, 'gi');
		let result = collectionNames[i].innerText.replace(reg,'<span class="reg">$&</span>');
		collectionNames[i].innerHTML = result;
	}
})

class Table{
	constructor(users){
		this.users = users;
	}
	render(count=0){
		if(Array.isArray(this.users))
			this.users.forEach(function(user, i){
				let pers = new Person(user);
				let str = document.createElement('tr');
				str.classList.add('main');
				str.style.fontSize = '1.2em';
				str.innerHTML=
				`<td>${pers.renderAva}</td>
				<td>${pers.lastName}</td>
				<td class="firstName">${pers.firstName}</td>
				<td>${pers.login}</td>
				<td>${pers.phone}</td>
				<td>${pers.location}</td>
				<td><span class="icon"><i class="fas fa-plus fa-2x"></i></span></td>`;
				tbody.appendChild(str);

				let info = new Detalis(user);
				let subStr = document.createElement('tr');
				subStr.style.display = 'none';
				subStr.innerHTML=
				`<td></td>
				<td colspan='2'><span class="name">${info.fullName}</span><br>
				<span><b>Username:</b> ${info.login}</span><br>
				<span><b>Registered:</b> ${info.regDate}</span><br>
				<span><b>Email:</b> ${info.email}</span></td>
				<td><br>${info.location}</td>
				<td><br><span><b>Birthday:</b> ${info.birthday}</span><br>
				<span><b>Phone:</b> ${info.phone}</span><br>
				<span><b>Cell:</b> ${info.cell}</span>
				</td>
				<td><div style='text-align:center;'>${info.photo}</div></td>
				<td></td>`;
				tbody.appendChild(subStr);
				if(i%2==0){
					str.style.background ='whitesmoke';
					subStr.style.background ='whitesmoke';
				}
				str.addEventListener('click', ()=>{
					let elem =document.getElementsByClassName('main');
					if(count<=0){
						elem[i].nextElementSibling.style.display = 'table-row';
						elem[i].lastChild.innerHTML = '<i class="fas fa-minus fa-2x"></i>';
						count=1;
					}
					else if(count>0 && elem[i].nextElementSibling.style.display!="table-row"){
						for(let j=0; j<elem.length; j++){
							elem[j].nextElementSibling.style.display = "none";
							elem[j].lastChild.innerHTML = '<i class="fas fa-plus fa-2x"></i>';
							elem[i].nextElementSibling.style.display = 'table-row';
							elem[i].lastChild.innerHTML = '<i class="fas fa-minus fa-2x"></i>';
							count=1;
						}
					}
					else{
						elem[i].nextElementSibling.style.display = "none";
						elem[i].lastChild.innerHTML = '<i class="fas fa-plus fa-2x"></i>';
						count=0;
					}
				});	
			});
		else return;
	}
	chart(){
		var ctx = document.getElementById("myChart").getContext('2d');
		let gender = [0,0];
		this.users.forEach(function(user){
			user.gender == 'male'? gender[0]++ : gender[1]++;
		});
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ["Male","Female"],
				datasets: [{
					label: '# of Votes',
					data: gender,
					backgroundColor: [
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 99, 132, 0.2)',
					],
					borderColor: [
					'rgba(54, 162, 235, 1)',
					'rgba(255,99,132,1)',
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero:true
						}
					}]
				}
			}
		});
	}
}

class Person{
	constructor(user){
		this.user = user;
	}
	get renderAva(){
		return `<img src="${this.user.picture.thumbnail}">`;
	}
	get lastName(){
		return this.user.name.last.charAt(0).toUpperCase()+
		this.user.name.last.slice(1);
	}
	get firstName(){
		return this.user.name.first.charAt(0).toUpperCase()+
		this.user.name.first.slice(1);
	}
	get login(){
		return this.user.login.username;
	}
	get phone(){
		return this.user.phone;
	}
	get location(){
		return this.user.location.state.charAt(0).toUpperCase()+
		this.user.location.state.slice(1);
	}

}
class Detalis extends Person{
	constructor(user){
		super(user);
	}
	get fullName(){
		return `${super.firstName} ${super.lastName} <i class="fa ${this.user.gender=='male'?'fa-male':'fa-female'}"aria-hidden="true"></i>`;
	}
	get regDate(){
		return this.user.registered.date.substr(0,10);
	}
	get email(){
		return this.user.email;
	}
	get location(){
		return `<span><b>Addres:</b> ${this.user.location.street}</span><br>
		<span><b>City:</b> ${this.user.location.city}</span><br>
		<span><b>Zip Code:</b> ${this.user.location.postcode}</span>`;
	}
	get birthday(){
		return this.user.dob.date.substr(0,10);
	}
	get cell(){
		return this.user.cell;
	}
	get photo(){
		return `<img src="${this.user.picture.large}">`;
	}
}

document.getElementById('close').addEventListener('click',()=>{
	document.getElementById('box').classList.add('hidden');
})
document.getElementById('chart').addEventListener('click',()=>{
	if(document.getElementById('box').className == 'hidden'){
		document.getElementById('box').classList.remove('hidden');
	}
})
