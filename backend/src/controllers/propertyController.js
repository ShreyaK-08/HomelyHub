// get all properties
// get property based on id


import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import imagekit from "../utils/ImagekitIO.js";


// get all properties

const getProperties = async(req,res)=>{
    try{
      const countFeatures = new APIFeatures(Property.find(), req.query)
        .filter()
        .search();
      const totalFiltered = await countFeatures.query.countDocuments();

      const features = new APIFeatures(Property.find(), req.query)
        .filter()
        .search()
        .paginate();

      const doc = await features.query;

      res.status(200).json({
        status: "success",
        no_of_responses: doc.length,
        all_properties: totalFiltered,
        data: doc,
      });
    }catch(error){
        console.error("Error searching properties: ", error)
            res.status(500).json({error:"Internal server Error"})
    }
}

//get property by id
// http://localhost:8080/api/v1/rent/listing/:id
//http://localhost:8080/api/v1/rent/listing/666476848
// req.params.id

const getProperty = async(req,res)=>{
    try{
       const property = await Property.findById(req.params.id);

       res.status(200).json({
        status:"success",
        data: property,
       })

    }catch(error){
      res.status(404).json({
        status:"fail",
        message:error.message
      })
    }
}

// CREATE A PROPERTY - an owner adds a property
const createProperty = async (req, res) => {
  try {
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body;

    const uploadedImages = [];

    if (Array.isArray(images)) {
      for (const image of images) {
        try {
          if (process.env.IMAGEKIT_PUBLICKEY && process.env.IMAGEKIT_PRIVATEKEY && image.url && !image.url.startsWith("http")) {
            const result = await imagekit.upload({
              file: image.url,
              fileName: `property_${Date.now()}.jpg`,
              folder: "property_images",
            });
            uploadedImages.push({ url: result.url, public_id: result.fileId });
          } else {
            uploadedImages.push({
              url: image.url || image,
              public_id: image.public_id || `img_${Date.now()}`,
            });
          }
        } catch (imgError) {
          console.warn("Image upload fallback:", imgError.message);
          uploadedImages.push({
            url: image.url || image,
            public_id: image.public_id || `img_${Date.now()}`,
          });
        }
      }
    }

    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime: checkInTime || "11:00",
      checkOutTime: checkOutTime || "13:00",
      maximumGuest,
      price,
      images: uploadedImages,
      userId: req.user._id || req.user.id,
    });

    res.status(200).json({ status: "success", data: { data: property } });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// GET MY PROPERTIES - the owner's own dashboard
const getUsersProperties = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const property = await Property.find({ userId });
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};

export {
  getProperties,
  getProperty,
  createProperty,
  getUsersProperties,
};