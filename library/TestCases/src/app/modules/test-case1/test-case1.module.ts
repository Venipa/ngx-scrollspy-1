import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxScrollspyModule } from '@uniprank/ngx-scrollspy';

import { TestCase1RoutingModule } from './test-case1-routing.module';
import { TestCase1Component } from './test-case1.component';

@NgModule({
    declarations: [TestCase1Component],
    imports: [CommonModule, TestCase1RoutingModule, NgxScrollspyModule.forRoot()]
})
export class TestCase1Module {}
