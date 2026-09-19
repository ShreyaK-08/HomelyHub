// ---- APIFeatures: builds the search query, 
// The listings page has filters, a search box and pages. Doing
// all that inside the controller would make it 100 lines long.
// So we keep it here, and the controller stays clean:
//     new APIFeatures(Property.find(), req.query)
//       .filter().search().paginate()
//
// A class is a blueprint. 'new' makes one copy to work with.
class APIFeatures {
  // constructor runs once, when we say 'new APIFeatures(...)'
  // query       = the unfinished mongoose search
  // queryString = what the user asked for (req.query), the
  //               part of the address after the ? mark
  constructor(query, queryString) {
    (this.query = query), (this.queryString = queryString);
  }

  // FILTER - price, type, room, amenities
  filter() {
    let filterQuery = {};
    let queryObj = { ...this.queryString };

    // PRICE: Handle numeric comparison for minPrice and maxPrice
    if (
      queryObj.minPrice !== undefined &&
      queryObj.maxPrice !== undefined &&
      queryObj.minPrice !== "" &&
      queryObj.maxPrice !== ""
    ) {
      const minP = Number(queryObj.minPrice);
      const isAbove =
        typeof queryObj.maxPrice === "string" && queryObj.maxPrice.includes(">");
      const maxP = isAbove ? null : Number(queryObj.maxPrice);

      if (maxP !== null && !isNaN(maxP)) {
        filterQuery.price = { $gte: minP, $lte: maxP };
      } else {
        filterQuery.price = { $gte: minP };
      }
    } else if (queryObj.minPrice !== undefined && queryObj.minPrice !== "") {
      filterQuery.price = { $gte: Number(queryObj.minPrice) };
    } else if (queryObj.maxPrice !== undefined && queryObj.maxPrice !== "") {
      filterQuery.price = { $lte: Number(queryObj.maxPrice) };
    }

    // TYPE: Case-insensitive match, supports comma-separated list and hyphenated names
    if (queryObj.propertyType) {
      const propertyTypeArray = (Array.isArray(queryObj.propertyType)
        ? queryObj.propertyType
        : queryObj.propertyType.split(",")
      )
        .map((value) => value.trim())
        .filter(Boolean);

      if (propertyTypeArray.length > 0) {
        const regexArray = propertyTypeArray.map((pt) => {
          const normalized = pt.replace(/-/g, " ").trim();
          return new RegExp(`^${normalized}$`, "i");
        });
        filterQuery.propertyType = { $in: regexArray };
      }
    }

    // ROOM TYPE: Match case-insensitively, ignore "Anytype"
    if (
      queryObj.roomType &&
      queryObj.roomType.trim() &&
      queryObj.roomType.toLowerCase() !== "anytype"
    ) {
      filterQuery.roomType = new RegExp(`^${queryObj.roomType.trim()}$`, "i");
    }

    // AMENITIES: Support both queryObj.amenities and queryObj['amenities[]']
    const amenitiesRaw = queryObj.amenities || queryObj["amenities[]"];
    if (amenitiesRaw) {
      const amenitiesArray = (Array.isArray(amenitiesRaw)
        ? amenitiesRaw
        : [amenitiesRaw]
      )
        .flatMap((a) => (typeof a === "string" ? a.split(",") : [a]))
        .map((a) => a.trim())
        .filter(Boolean);

      if (amenitiesArray.length > 0) {
        filterQuery["amenities.name"] = {
          $all: amenitiesArray.map((name) => {
            const pattern = name.replace(/washing/i, "wa[sc]hing");
            return new RegExp(`^${pattern}$`, "i");
          }),
        };
      }
    }

    this.query = this.query.find(filterQuery);
    return this;
  }

  // SEARCH - destination (city/state/area/name), guests, dates
  search() {
    let searchQuery = {};
    let queryObj = { ...this.queryString };

    // DESTINATION: Case-insensitive regex matching across city, state, area, and propertyName
    if (queryObj.city && queryObj.city.trim()) {
      const cleanCity = queryObj.city.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(cleanCity, "i");
      searchQuery.$or = [
        { "address.city": regex },
        { "address.state": regex },
        { "address.area": regex },
        { propertyName: regex },
      ];
    }

    // GUESTS: Numerical comparison
    if (queryObj.guests && !isNaN(Number(queryObj.guests))) {
      searchQuery.maximumGuest = { $gte: Number(queryObj.guests) };
    }

    // DATES: Parse DD-MM-YYYY or ISO date strings for collision checking
    if (queryObj.dateIn && queryObj.dateOut) {
      const parseDate = (dStr) => {
        if (!dStr) return null;
        if (typeof dStr === "string" && dStr.includes("-")) {
          const parts = dStr.split("-");
          if (parts[0].length === 2 && parts[2]?.length === 4) {
            return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00.000Z`);
          }
        }
        return new Date(dStr);
      };

      const dateInObj = parseDate(queryObj.dateIn);
      const dateOutObj = parseDate(queryObj.dateOut);

      if (dateInObj && dateOutObj && !isNaN(dateInObj) && !isNaN(dateOutObj)) {
        searchQuery.$and = [
          {
            currentBookings: {
              $not: {
                $elemMatch: {
                  $or: [
                    {
                      fromDate: { $lt: dateOutObj },
                      toDate: { $gt: dateInObj },
                    },
                  ],
                },
              },
            },
          },
        ];
      }
    }

    this.query = this.query.find(searchQuery);
    return this;
  }

  // PAGINATE - show 8 per page (2 rows of 4 cards on desktop) by default
  paginate() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 8;
    let skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}


// propertyController imports this to build the listings search
export { APIFeatures };
