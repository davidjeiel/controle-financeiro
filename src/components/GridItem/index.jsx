import React from "react";
import {
  FaRegArrowAltCircleUp,
  FaRegArrowAltCircleDown,
  FaTrash,
} from "react-icons/fa";

const GridItem = ({ item, onDelete }) => {
  return (
      <tr >
        <td className="text-light">{item.desc}</td>
        <td className="text-light">{item.amount}</td>
        <td className="text-light">{item.type}</td>
        <td>
          {item.expense ? (
            <FaRegArrowAltCircleDown color="red" />
          ) : (
            <FaRegArrowAltCircleUp color="green" />
          )}
        </td>
        <td className="text-light">
          <FaTrash onClick={() => onDelete(item.id)} />
        </td>
      </tr>
  );
};

export default GridItem;
