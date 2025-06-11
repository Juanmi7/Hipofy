import classes from "./Purchased.module.css";
import { useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons/faBasketShopping";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons/faCircleCheck";
import DeleteButton from "../../DeleteButton/DeleteButton";
import Modal from "../../../Modal/Modal";
import Spinner from "../../../Spinner/Spinner";
import AlertH from "../../../Alert/Alert";

const Purchased = (props) => {
  //UseStates
  const [openModal, setOpenModal] = useState(false);

  //Const declarations
  const data = props.data;
  const price = localStorage.getItem("price");

  // Handle functions
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  return (
    <div className={classes.purchased}>
      {props.isLoading ? (
        <Spinner />
      ) : props.error ? (
        <AlertH text="Lo sentimos, algo salió mal... ¡Inténtalo de nuevo!" />
      ) : props.length === 0 ? (
        <p>Aún no tienes ninguna lista. ¡Agrega una!</p>
      ) : (
        <>
          <div className={classes["list-header"]}>
            <h3>{data.name_list}</h3>
            <span>{data.status}</span>
          </div>

          <div className={classes["list-body"]}>
            <div className={classes["list-body-header"]}>
              <p>Productos:</p>
              <p>{new Date(data.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={classes["list-body-products"]}>
              <ul>
                {data.id_products.map((product) => {
                  return <li key={product.id}> {product.name} </li>;
                })}
              </ul>
            </div>
            <div className={classes["list-body-footer"]}>
              {data.id_products.length === 1 ? (
                <p>Total: {data.id_products.length} producto</p>
              ) : (
                <p>Total: {data.id_products.length} productos</p>
              )}
            </div>
          </div>

          <div className={classes["list-footer"]}>
            <div className={classes.market}>
              <Icon icon={faBasketShopping} />
              <span>{data.supermarkets}</span>
            </div>
            <div className={classes.market}>
              <Icon icon={faDollarSign} />
              <span>Total estimado: {data.price} €</span>
            </div>
            <div className={classes.buttons}>
              <button onClick={handleOpenModal}>
                Ver ticket <Icon icon={faCircleCheck} />
              </button>
              <DeleteButton data={data} />
            </div>
          </div>
          {openModal && (
            <Modal
              filter={openModal}
              openModal={openModal}
              close={handleCloseModal}
              content={
                <div>
                  {data.ticket.url !== "" ? (
                    <>
                      <p>
                        Añadido el{" "}
                        {new Date(data.ticket.addedAt).toLocaleDateString()}.
                      </p>
                      <img src={data.ticket.url} alt="ticket" />
                    </>
                  ) : (
                    <p>Todavía no se ha adjuntado ningún ticket.</p>
                  )}
                </div>
              }
              classesModalContent={classes["modal-content"]}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Purchased;
