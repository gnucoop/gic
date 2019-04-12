import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SelectComponent } from './select/select.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'autocomplete', component: AutocompleteComponent },
  { path: 'select', component: SelectComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
