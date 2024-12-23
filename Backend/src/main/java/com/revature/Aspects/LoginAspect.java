package com.revature.Aspects;

import jakarta.servlet.http.HttpSession;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class LoginAspect {


    @Before("within(com.revature.Controllers.*)"+
    "&& !execution(* com.revature.Controllers.UserController.loginUser(..))" +
    "&& !execution(* com.revature.Controllers.UserController.registerUser(..))")
    public void checkLogin(){
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();

        HttpSession session = attr.getRequest().getSession(false);

        if(session == null || session.getAttribute("userID") == null){
            throw new IllegalArgumentException("You must be logged in to access this functionality");
        }
    }

    @Before("@annotation(ManagerOnly)")
    public void checkManager(){
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();

        HttpSession session = attr.getRequest().getSession(false);

        if(!(session.getAttribute("role").equals("Manager"))){
            throw new IllegalArgumentException("You must be a manager to access this functionality");
        }
    }
}
