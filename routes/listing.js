const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //Index Route
  .get(wrapAsync(listingController.index))
  //Create Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Privacy and Terms
router.get("/privacy", wrapAsync(listingController.privacy));
router.get("/terms", wrapAsync(listingController.terms));

//Category
router.get("/mountains", wrapAsync(listingController.mountains));
router.get("/rooms", wrapAsync(listingController.rooms));
router.get("/cities", wrapAsync(listingController.cities));
router.get("/beaches", wrapAsync(listingController.beaches));
router.get("/pools", wrapAsync(listingController.pools));
router.get("/camping", wrapAsync(listingController.camping));
router.get("/farms", wrapAsync(listingController.farms));
router.get("/arctic", wrapAsync(listingController.arctic));
router.get("/houseboats", wrapAsync(listingController.houseboats));
router.get("/payment", wrapAsync(listingController.payment));

router
  .route("/:id")
  //Show Route
  .get(wrapAsync(listingController.showListing))
  //Update Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //Delete Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
