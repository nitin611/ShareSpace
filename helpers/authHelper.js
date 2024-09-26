import bcrypt from 'bcrypt'
// function for hashing the password--
export const hashedPassword=async(password)=>{
    try {
        const saltRoundes=7;
        const hashedPass=await bcrypt.hash(password,saltRoundes);
        return hashedPass
    } catch (err) {
        console.log(err)
    }
}

// comaparing normal with hashedpassword-
export const comparePassword=async(password,hashedPass)=>{
    return bcrypt.compare(password,hashedPass);
}