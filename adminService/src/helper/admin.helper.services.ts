export const validateAdminData = async (data: any) => {
    try {
        if (data.firstName.length == 0 || data.lastName.length == 0 || data.username.length == 0 || data.email.length == 0 || data.password.length == 0 || data.phoneNumber.length != 10 ) {
            throw new Error ('Please Provide all details');
        }

        console.info("password.length ==> ", data.password.length);
        if (data.password.length < 10) {
            console.log(`Password Length Must be Greater Than or Equal To 10`);
            throw  new Error ("Password Length Must be Greater Than or Equal To 10");
        }
        let paswd = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,30}$/;
        if (!data.password.match(paswd)) {
            console.debug(`Your Password Must Contain At Least One Uppercase, One Numeric Digit and a Special Character`);
            throw new Error ("Your Password Must Contain At Least One Uppercase, One Numeric Digit and a Special Character")
        }
    } catch (error) {
        console.log("🚀 ~ file: admin.helper.services.ts:5 ~ validateAdminData ~ error:", error)
        throw(error);
    }
}

export const validateEmail = async (email: string) => {
    let emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    try {
        if (!email)
            return false;
        if (email.length > 254)
            return false;
        let valid = emailRegex.test(email);
        if (!valid)
            return false;
        let parts = email.split("@");
        if (parts[0].length > 64)
            return false;
        let domainParts = parts[1].split(".");
        if (domainParts.some(function (part) { return part.length > 63 }))
            return false;
        return true;
    }
    catch (e: any) {
        console.log("Error in validateEmail Function : ", e);
        return (e.message);
    }

}