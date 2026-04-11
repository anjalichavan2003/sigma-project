const Listing = require("../models/listing");

//Map code
const axios = require("axios");

async function getCoordinates(location) {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "AnjaliProject/1.0 (anju6@gmail.com)",
      },
    },
  );

  const data = response.data;

  if (data.length > 0) {
    return {
      type: "Point",
      coordinates: [
        parseFloat(data[0].lon), // lng
        parseFloat(data[0].lat), // lat
      ],
    };
  }

  return null;
}

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.index = async (req, res) => {
//   let { category } = req.query;

//   let allListings;

//   if (category) {
//     allListings = await Listing.find({ category });
//   } else {
//     allListings = await Listing.find({});
//   }

//   res.render("listings/index.ejs", { allListings });
// };

module.exports.index = async (req, res) => {
  let { category, search } = req.query;

  let query = {};

  // 🔍 Search logic
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } },
    ];
  }

  // 📂 Category filter
  if (category) {
    query.category = category;
  }

  const allListings = await Listing.find(query);

  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  //   console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};
//before map code
// module.exports.createListing = async (req, res, next) => {
//   let url = req.file.path;
//   let filename = req.file.filename;

//   const newListing = new Listing(req.body.listing); //Create Instance  Of Listing
//   newListing.owner = req.user._id;
//   newListing.image = { url, filename };
//   await newListing.save();
//   req.flash("success", "New Listing Created!");
//   res.redirect("/listings");
// };

module.exports.createListing = async (req, res, next) => {
  try {
    const geometry = await getCoordinates(req.body.listing.location);

    console.log(geometry);

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // ✅ SAME as Mapbox output
    newListing.geometry = geometry;

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", " Listing Deleted!");
  res.redirect("/listings");
};
