import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { About } from './about/about';
import { Store } from './store/store';
import { Employee } from './employee/employee';
import { UserComponent } from './user/user';
import { Categories } from './categories/categories';
import { OrderHistory } from './order-history/order-history';
import { Summary } from './summary/summary';



export const routes: Routes = [
    {path: "", component: Login},
    {path: 'login', component: Login},
    { path: 'home', component: Home},
    {path: 'about', component:About},
    {path: 'store', component: Store},
    { path: 'users', component: UserComponent },
    {path:'employee', component:Employee},
    {path:'Categories', component:Categories},
    { path: 'history', component: OrderHistory },
    { path: 'summary', component: Summary},
    { path: '**', redirectTo: '', pathMatch: 'full' }


    
];
