import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import {BehaviorSubject, Subject, throwError} from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

// this is what our response object will look like. this is optional
export interface AuthResponseData{
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean // optional parameter, login needs this signup doesn't
}

@Injectable({providedIn: 'root'})
export class AuthService{
    user = new BehaviorSubject<User>(null); // always tell if there's a change in user or there's new user, also lets subscribe to previous obsverable
    private tokenExpirationTimer: any;
    
    constructor(private http: HttpClient, private router: Router){

    }

    autoLogin() {
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) { // get token method of user model being called
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    // this returns observable from http method and it is subscribed in the auth component class as without subscribing http request won't return anything
    signup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAV5JJl59VwYNY0SOcEgW12hJ1sXqhaKn0',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }
    login(email:string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAV5JJl59VwYNY0SOcEgW12hJ1sXqhaKn0',
        {
            email:email,
            password: password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError),tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }));
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer=null;
    }
    // will be called every time new user available 
    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        },expirationDuration);
    }

    private handleAuthentication(email:string,userId: string, token:string, expiresIn:number){
        const expirationDate = new Date(new Date().getTime() + expiresIn*1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn*1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    // error conversion service happens here
    private handleError(errorRes:HttpErrorResponse){
        let errorMessage='An unknown error occurred';
        if(!errorRes.error||!errorRes.error.error){
          return throwError(errorMessage); // returning observable that wraps the error message
        }
        switch(errorRes.error.error.message){
          case 'EMAIL_EXISTS':
            errorMessage='This email exists'
            break;
          case 'EMAIL_NOT_FOUND':
            errorMessage='Email not found'
            break;
          case 'INVALID_PASSWORD':
            errorMessage='Password not valid'
            break;
           
        }
        return throwError(errorMessage);
    }
}



