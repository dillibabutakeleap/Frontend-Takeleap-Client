import { Component, Input, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'print-feed',
  templateUrl: './print-feed.component.html',
  styleUrls: ['./print-feed.component.scss']
})
export class PrintFeedComponent implements OnInit {
  @Input() anomalies: any;
  @Input() tabIndex: number;
  @Input() selectedTabIndex: number;
  @Input() historyDates: any[];
  @Input() tabName:string;

  constructor() {

  }

  ngAfterContentInit(): void {
    //return;
    //alert("hi");
    var date = this.tabName.split(":")[1];

    setTimeout(() => {

      let PDF = new jsPDF('p', 'mm', 'a4');
      let counter = 0;
      for (var i = 0; i < this.anomalies.length; i++) {

        let DATA = document.getElementById('htmlData' + i);
        html2canvas(DATA).then(canvas => {
          
          let fileWidth = 208;
          let fileHeight = canvas.height * fileWidth / canvas.width;

          const FILEURI = canvas.toDataURL('image/png')

          let position = 0;

          if (counter > 0) {
            PDF.addPage();
          }

          PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
          
          if (counter == (this.anomalies.length - 1)) {
            PDF.save(date + '.pdf');
          }
          counter++;
          //

        });
      }
      
    }, 200);

    // Call the method creating a child component of class 'ComponentA' inside the template

  }

  ngOnInit(): void {
    console.log(this.anomalies);
    
  }

}
