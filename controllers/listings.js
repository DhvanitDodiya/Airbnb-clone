const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;
  console.log(newListing);
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "New Listing  Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_300");
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
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing  Deleted!");
  res.redirect("/listings");
};

//Category
module.exports.mountains = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/mountains.ejs", { allListings });
};

module.exports.rooms = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/rooms.ejs", { allListings });
};

module.exports.cities = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/cities.ejs", { allListings });
};

module.exports.beaches = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/beaches.ejs", { allListings });
};

module.exports.pools = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/pools.ejs", { allListings });
};

module.exports.camping = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/camping.ejs", { allListings });
};

module.exports.farms = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/farms.ejs", { allListings });
};

module.exports.arctic = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/arctic.ejs", { allListings });
};

module.exports.houseboats = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("categories/houseboats.ejs", { allListings });
};

module.exports.privacy = async (req, res) => {
  res.render("includes/privacy.ejs");
};

module.exports.terms = async (req, res) => {
  res.render("includes/terms.ejs");
};

module.exports.payment = async (req, res) => {
  res.render("categories/paymenterror.ejs");
};
