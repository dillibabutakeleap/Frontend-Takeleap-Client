export class AppSettings {
    public static readonly BaseURL = 'http://localhost:8081/';
    public static readonly SocketURL = 'http://localhost:10025';
    //Anomalies
    public static readonly API_ANOMALIES = AppSettings.BaseURL + 'anomaly';
    public static readonly API_ANOMALIES_History = AppSettings.API_ANOMALIES + '/history';
    public static readonly API_ANOMALIES_HistoryDates = AppSettings.API_ANOMALIES + '/get_history_dates';
    public static readonly API_ANOMALIES_EXPORTFILE = AppSettings.API_ANOMALIES + '/exportFile';
    //Account
    public static readonly API_ACCOUNT_LOGIN = AppSettings.BaseURL + 'account/login';
    //Video
    public static readonly API_VIDEO_DELETE = AppSettings.BaseURL + 'video/delete';
    public static readonly API_VIDEO_STATUS = AppSettings.BaseURL + 'video/status';
    public static readonly API_VIDEO_UPLOAD = AppSettings.BaseURL + 'video/upload';
    public static readonly API_VIDEO_DELETE_INPROGRESS = AppSettings.BaseURL + 'video/delete-in-progress';
    public static readonly API_VIDEO_UPDATE_UNPROCESSED = AppSettings.BaseURL + 'video/updateUnprocessed';
    public static readonly API_VIDEO_GETDISKSPACE = AppSettings.BaseURL + 'video/getAvailableDiskSpace';
    //Assets
    public static readonly API_ASSET_ALL = AppSettings.BaseURL + 'asset/all';
    //Notifications
    public static readonly API_NOTIFICATION_ALL = AppSettings.BaseURL + 'notification';
    public static readonly API_NOTIFICATION_VIEWED = AppSettings.BaseURL + 'notification/viewed';
    public static readonly API_NOTIFICATION_DELETE = AppSettings.BaseURL + 'notification/delete';

    public static VideoUploadStatus;

    public static SetVideoUploadStatus(status) {
        localStorage.setItem('videoUploadStatus', status);
    }

    public static GetVideoUploadStatus() {
        localStorage.getItem('videoUploadStatus');
    }

    public static readonly ANOMALIESPAGESIZE = 20; //default page size is kept to 50 for anomaly results 
    public static readonly VIDEO_LAG_WAIT_TIME = 300000; //5MINTS WAIT 
}