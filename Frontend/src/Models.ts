interface User{
    userID:number,
    username:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string
}

interface RegisterUser{
    username:string,
    password:string,
    confirmPassword:string,
    firstName:string,
    lastName:string,
    email:string,
    role:string
}

interface newReimbursement{
    title:string,
    description:string,
    amount:number,
    userID:number
}

interface Reimbursement{
    reimbursementID:number,
    title:string,
    description:string,
    amount:number,
    status:string,
    user:User
}


export type {User, RegisterUser, Reimbursement, newReimbursement};