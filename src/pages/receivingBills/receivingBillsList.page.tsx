import { useContext, useEffect, useState } from "react";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { VscEdit, VscTrash } from "react-icons/vsc";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { Link } from "react-router-dom";
import { deleteReceivingBillsById, searchReceivingBills } from "../../services/receivingBills.service";
import { DateUtils } from "../../utils/date";
import { ButtonMenuComponent } from "../../components/buttonMenu/buttonMenu.component";

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
  const { searchPressed, setSearchPressed, setUrlToNew } = useContext(ButtonMenuContext);
  const [searchFilter, setSearchFilter] = useState<string>('');
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
        setReceivingBills(data.filter((i) => searchFilter && i.user.name.toUpperCase().includes(searchFilter.toUpperCase()) || !searchFilter));
      });

      setSearchPressed(false);
    }
  }, [searchPressed]);

  const executeOnPageLoad = () => {
    searchReceivingBills((data: ReceivingBillsList[]) => {
      setReceivingBills(data);
    });
  };

  const handleDelete = (id: string) => {
    deleteReceivingBillsById(id).then(() => {
      executeOnPageLoad()
    })
  }

  return (
    <>
      <ButtonMenuComponent searchFilter={searchFilter} setSearchFilter={setSearchFilter}/>
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Dt. Vencimento</th>
            <th>Dt. Pagamento</th>
            <th>Ação</th>
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
                      <button type="button" className="btn btn-outline-danger ml-1" onClick={() => handleDelete(data.id)}>
                      <VscTrash size="14"/>
                    </button>
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
