import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root',
})

export class VideosProcessed {
    id: number;
    name: string;
    progress: number;


    private isSocketReceived: boolean;
    private videos = new BehaviorSubject<VideosProcessed[]>(null);

    constructor() {
        this.videos.next(this.currentValue);
        this.isSocketReceived = false;

        var deleteVideos = JSON.parse(localStorage.getItem('VideosDeleted'));
        if (!deleteVideos) {
            localStorage.setItem('VideosDeleted', JSON.stringify([]));
        }

        var processedVideos = JSON.parse(localStorage.getItem('VideosProcessed'));

        if (!processedVideos) {
            localStorage.setItem('VideosProcessed', JSON.stringify([]));
        }
        //console.log(processedVideos);
    }

    public ResetData() {
        localStorage.setItem('VideosDeleted', JSON.stringify([]));
        localStorage.setItem('VideosProcessed', JSON.stringify([]));
    }

    public get currentValue() {
        return <VideosProcessed[]>(JSON.parse(localStorage.getItem('VideosProcessed')));
    }

    public get current() {
        return this.videos.asObservable();
    }

    public set setCurrentValueRaw(value) {
        localStorage.setItem('VideosProcessed', JSON.stringify(value));
    }

    public set setDeletedVideos(value) {
        var deletedVideos = <Number[]>(JSON.parse(localStorage.getItem('VideosDeleted')));
        if (!deletedVideos) {
            deletedVideos = [];
        }
        deletedVideos.push(value);
        //console.log(deletedVideos);
        localStorage.setItem('VideosDeleted', JSON.stringify(deletedVideos));
    }

    public get getDeletedVideos() {
        //console.log(localStorage.getItem('VideosDeleted'));
        var deletedVideos = <Number[]>(JSON.parse(localStorage.getItem('VideosDeleted')));
        //console.log(deletedVideos);
        return deletedVideos;
    }

    public set currentValue(value: VideosProcessed[]) {

        if (!this.isSocketReceived && value != null) {
            this.isSocketReceived = true;
            var progress = 0;
            let previousVideos1 = <VideosProcessed[]>(JSON.parse(localStorage.getItem('VideosProcessed')));//JSON.parse(localStorage.getItem('VideosProcessed'));//
            let previousVideosCopy = <VideosProcessed[]>(JSON.parse(localStorage.getItem('VideosProcessed')));
            //console.log(value);
            if (!previousVideos1) {
                previousVideos1 = [];
            }
            if (!previousVideosCopy) {
                previousVideosCopy = [];
            }

            //Update progress value of previous videos or pusing new videos
            for (var i = 0; i < value.length; i++) {
                var element = value[i];
                //value.forEach(element => {
                var filtrvideos = previousVideos1.filter(x => x.id == element.id);

                // console.log(element);
                // console.log(filtrvideos);
                if (filtrvideos.length > 0 ) {
                    filtrvideos[0].progress = element.progress;
                }
                else {
                    previousVideos1.push(element);
                    // console.log("added");
                    // console.log(previousVideos);
                    // console.log(element);
                }

                progress += element.progress;

                //});
            }

            //marking previous elemnts progress to 100
            previousVideosCopy.forEach(function (element, i) {
                var filtrvideos = value.filter(x => x.id == element.id);
                var deletedVideos = <Number[]>(JSON.parse(localStorage.getItem('VideosDeleted')));
                if (!deletedVideos) {
                    deletedVideos = [];
                }

                var deletedVideo = deletedVideos.filter(x => x == element.id);

                //making previous videos which are not present in new data to 100
                if (filtrvideos.length == 0 && deletedVideo.length == 0) {
                    //previousVideos.splice(i,1);
                    previousVideos1[i].progress = 100;
                }
                else if (deletedVideo.length > 0) {

                    previousVideos1.splice(previousVideos1.indexOf(element), 1);
                }

            });

            // console.log(previousVideos1);
            // console.log(localStorage.getItem('VideosProcessed'));
            // return;

            progress = (progress / (value.length * 100)) * 100;
            //making local list empty in case api returns no record or all are 100%
            if (value.length == 0 || progress == 100) {
                previousVideos1 = [];
            }

            
            localStorage.setItem('VideosProcessed', JSON.stringify(previousVideos1));
            this.videos.next(previousVideos1);
            this.isSocketReceived = false;
        }
        return;
    }

    public get calculateTotalProgress() {

        var totalProgress = 0;
        //console.log(this.selectedFiles);
        var selectedFiles = <VideosProcessed[]>(JSON.parse(localStorage.getItem('VideosProcessed')));
        if (selectedFiles == null || selectedFiles.length == 0)
            return totalProgress;

        selectedFiles.forEach(element => {
            if (element.progress != null)
                totalProgress += element.progress;
        });

        totalProgress = totalProgress > 0 ? (totalProgress / (selectedFiles.length * 100)) * 100 : totalProgress;
        // if (totalProgress == 100)
        //     this.currentValue = [];
        if (selectedFiles.length == 0)
            totalProgress == null;

        return totalProgress;
    }

}
