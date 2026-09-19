import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import "../../css/Home.css";

import {useDispatch, useSelector} from "react-redux";
import {propertyAction} from "../../store/Property/property-slice"
import { getAllProperties } from "../../store/Property/property-action";

const Card = ({ id, image, name, address, price }) => {
  return (
    <figure className="property">
      <Link to={`/propertylist/${id}`}>
        <img src={image} alt="Propertyimg" />
      </Link>
      <h4>{name}</h4>
      <figcaption>
        <main className="propertydetails">
          <h5>{name}</h5>

          <h6>
            <span className="material-symbols-outlined houseicon">
              home_pin
            </span>
            {address}
          </h6>
          <p>
            <span className="price"> ₹{price}</span> per night
          </p>
        </main>
      </figcaption>
    </figure>
  );
};

const PropertyList = () => {
  const [currentPage, setCurrentPage] = useState({ page: 1 });
  const PAGE_LIMIT = 8;
  
  const dispatch = useDispatch();
  const { properties, totalProperties } = useSelector((state) => state.properties);

  const effectiveTotal =
    typeof totalProperties === "number" && totalProperties > 0
      ? totalProperties
      : properties.length;
  const lastPage = Math.max(1, Math.ceil(effectiveTotal / PAGE_LIMIT));

  const propertyListRef = useRef(null);

  useEffect(() => {
    dispatch(propertyAction.updateSearchParams({ page: currentPage.page, limit: PAGE_LIMIT }));
    dispatch(getAllProperties());
  }, [currentPage.page, dispatch]);

  useEffect(() => {
    if (currentPage.page > lastPage && lastPage >= 1) {
      setCurrentPage({ page: 1 });
    }
  }, [lastPage]);

  useEffect(() => {
    if (propertyListRef.current) {
      gsap.fromTo(
        propertyListRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [properties]);

  const handlePrevPage = () => {
    if (currentPage.page > 1) {
      setCurrentPage((prev) => ({ page: prev.page - 1 }));
    } else if (lastPage > 1) {
      setCurrentPage({ page: lastPage });
    }
  };

  const handleNextPage = () => {
    if (currentPage.page < lastPage) {
      setCurrentPage((prev) => ({ page: prev.page + 1 }));
    } else if (lastPage > 1) {
      setCurrentPage({ page: 1 });
    }
  };

  return (
    <>
      {properties.length === 0 ? (
        <p className={"not_found"}>Property not found</p>
      ) : (
        <div className="propertylist" ref={propertyListRef}>
          {properties.map((property) => (
            <Card
              key={property._id}
              id={property._id}
              image={property.images?.[0]?.url || "https://picsum.photos/900/600"}
              name={property.propertyName}
              address={`${property.address.city}, ${property.address.state} ${property.address.pincode}`}
              price={property.price}
              slug={property.slug}
            />
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          className="previous_btn"
          aria-label="Previous Page"
          title="Previous Page"
          onClick={handlePrevPage}
          disabled={lastPage <= 1}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        <span className="page-indicator">
          Page {currentPage.page} of {lastPage}
        </span>

        <button
          className="next_btn"
          aria-label="Next Page"
          title="Next Page"
          onClick={handleNextPage}
          disabled={lastPage <= 1}
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </>
  );
};

export default PropertyList;
