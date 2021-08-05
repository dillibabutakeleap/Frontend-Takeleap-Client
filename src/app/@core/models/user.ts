import { BehaviorSubject } from 'rxjs';

export class User {
    id: string;
    username: string;
    password: string;
    first_name: string;
    last_ame: string;
    token?: string;
    FilesUploadBuffer: number;
    aws_user_id: number;

    private user = new BehaviorSubject<User>(null); // {1}

    constructor() {
        this.user.next(this.currentUserValue);
    }

    public get currentUserValue() {
        return <User>(JSON.parse(localStorage.getItem('currentUser')));
    }

    public get currentUser() {
        return this.user.asObservable();
    }

    public set currentUserValue(value: User) {
        localStorage.setItem('currentUser', JSON.stringify(value));
        this.user.next(value);
    }

    public logout() {
        this.currentUserValue = null;
        localStorage.clear();
    }

}
