// recv the users information
//validate the required information
// send the information to out AI trip planner
// Calculate the budget per night
// Seach Mongodb for suitable properties
// send both AI trip plan + matching prperties back to the frontend /user


import {Property} from "../Models/propertyModel.js"
import {planTrip} from "../ai/tripPlanner.js"
import {generateDescription} from "../ai/generateDescription.js"

const cleanCity = (text) => text.toLowerCase().replaceAll(" ", "")

const createTripPlan = async(req,res) =>{
    try{
        const {destination, budget, days, people, interests} = req.body

        if(!destination || !budget || !days || !people){
            return res.status(400).json({
                status:"fail",
                message:"Please fill in destination, budget, days, and people"
            })
        }

        if (Number(days) <= 0 || Number(budget) <= 0 || Number(people) <= 0) {
            return res.status(400).json({
                status:"fail",
                message:"Budget, days, and people must be positive numbers"
            })
        }

        const plan = await planTrip({
            destination, 
            budget, 
            days, 
            people, 
            interests : interests || []
        });

        const perNight = Number(budget) / Number(days);
        const cityClean = cleanCity(destination);
        const destRegex = new RegExp(destination.trim(), "i");
        const cityRegex = new RegExp(cityClean, "i");

        const properties = await Property.find({
            $or:[
                {"address.city": cityClean},
                {"address.city": destRegex},
                {"address.city": cityRegex},
                {"address.state": destRegex},
                {"address.state": cityRegex},
                {"address.area": destRegex},
                {"address.area": cityRegex}
            ],
            price:{$lte: perNight},
            maximumGuest:{$gte: Number(people)},
        }).limit(5);

        res.status(200).json({
            status:"success",
            data:{plan, properties, perNight }
        })

    }catch(error){
       console.error("Trip planning error:", error.message);
       res.status(500).json({
        status:"fail",
        message: error.message || "Could not create a trip plan, please try again"
       })
    }
}



const writeDescription = async(req,res)=>{
   try{
       const description = await generateDescription(req.body);

    res.status(200).json({status:"success", data:{description}})

   }catch(error){

        res.status(500).json({
        status:"fail",
        message:"Could not generate a description "
       })
   }
}

export {createTripPlan, writeDescription};