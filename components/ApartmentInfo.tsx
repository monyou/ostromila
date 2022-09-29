import type { Apartment } from "@prisma/client";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

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
        <UserOutlined css={{ marginRight: 5 }} /> {apartment.occupant}
      </div>
      <a href={`tel:${apartment.phone}`}>
        <PhoneOutlined css={{ marginRight: 5 }} /> {apartment.phone}
      </a>
      <a href={`mailto:${apartment.email}`}>
        <MailOutlined css={{ marginRight: 5 }} /> {apartment.email}
      </a>
    </div>
  );
};

export default ApartmentInfo;
