import type { Apartment } from "@prisma/client";

const ApartmentInfo = ({ apartment }: { apartment: Apartment }) => {
  return (
    <div
      css={{
        display: "flex",
        flexFlow: "column nowrap",
        gap: 5,
      }}
    >
      <div>
        <i className="fa-solid fa-user" css={{ marginRight: 5 }}></i>{" "}
        {apartment.occupant}
      </div>
      <a href={`tel:${apartment.phone}`}>
        <i className="fa-solid fa-phone" css={{ marginRight: 5 }}></i>{" "}
        {apartment.phone}
      </a>
      {/* <a href={`mailto:${apartment.email}`}>
        <i className="fa-solid fa-envelope" css={{ marginRight: 5 }}></i>{" "}
        {apartment.email}
      </a> */}
    </div>
  );
};

export default ApartmentInfo;
