import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit } from "react-icons/vsc";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Link } from "react-router-dom";
import { searchReceivingBills } from "../../services/receivingBills.service";
import { DateUtils } from "../../utils/date";

export type ReceivingBillsList = {
  id: string;
  description: string;
  amount: number;
  expirationAt: string;
  paidAt: string;
  user: {
    id: string;
    name: string;
  };
};

export function ReceivingBillsListPage() {
  const { setPageTitle } = useContext(TitlePageContext);
  const { searchPressed, setSearchPressed, setUrlToNew } =
    useContext(ButtonMenuContext);

  const [receivingBills, setReceivingBills] = useState<ReceivingBillsList[]>(
    []
  );

  useEffect(() => {
    setReceivingBills([]);
    setPageTitle("Recebimentos");
    setUrlToNew("/receivingBills/new");

    executeOnPageLoad();
  }, []);

  useEffect(() => {
    if (searchPressed) {
      searchReceivingBills((data: ReceivingBillsList[]) => {
        setReceivingBills(data);
      });

      setSearchPressed(false);
    }
  }, [searchPressed]);

  const executeOnPageLoad = () => {
    searchReceivingBills((data: ReceivingBillsList[]) => {
      setReceivingBills(data);
    });
  };

  return (
    <>
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Dt. Vencimento</th>
            <th>Dt. Pagamento</th>
          </tr>
        </thead>
        {receivingBills.length > 0 ? (
          <tbody>
            {receivingBills.map((data) => {
              return (
                <tr key={data.id}>
                  <td>{data.user.name}</td>
                  <td>{data.description}</td>
                  <td> {data.amount}</td>
                  <td> {DateUtils.formatDateWithoutTime(data.expirationAt)}</td>
                  <td> {DateUtils.formatDateWithoutTime(data.paidAt)}</td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Link
                        to={"receivingBills/edit/:id".replace(":id", data.id)}
                      >
                        <button type="button" className="btn btn-outline-info">
                          <VscEdit size="14" />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td>Nenhum dado encontrado...</td>
            </tr>
          </tbody>
        )}
      </StripedTableComponent>
    </>
  );
}
