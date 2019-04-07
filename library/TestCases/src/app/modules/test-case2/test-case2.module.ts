import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxScrollspyModule } from '@uniprank/ngx-scrollspy';

import { TestCase2RoutingModule } from './test-case2-routing.module';
import { TestCase2Component } from './test-case2.component';

@NgModule({
    declarations: [TestCase2Component],
    imports: [CommonModule, TestCase2RoutingModule, NgxScrollspyModule.forRoot()]
})
export class TestCase2Module {}
