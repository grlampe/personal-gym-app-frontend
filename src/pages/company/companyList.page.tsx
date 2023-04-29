import { useContext, useEffect, useState } from "react";
import { VscEdit } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { StripedTableComponent } from "../../components/stripedTable/stripedTable.component";
import { ButtonMenuContext } from "../../contexts/buttonMenu.context";
import { TitlePageContext } from "../../contexts/titlePage.context";
import { searchCompanies } from "../../services/company.api";
import { urls } from "../../utils/consts";
import { Screens } from "../../utils/enums";
import { cpfCnpjMask } from "../../utils/masks";


export type CompaniesList = {
  id: string;
  cnpj: string;
  name: string;
}

export function CompanyListPage() {
  const {setPageTitle} = useContext(TitlePageContext);

  const [companies, setCompanies] = useState<CompaniesList[]>([]);

  const {searchPressed, setSearchPressed, setUrlToNew} = useContext(ButtonMenuContext);

  useEffect(() =>{
    setCompanies([]);
    setPageTitle('Empresas');
    setUrlToNew(urls.companyNew);
  },[])

  useEffect(() =>{
    if(searchPressed){
      searchCompanies((data: CompaniesList[]) => {
        setCompanies(data);
        setSearchPressed(false);
      });
    }
  },[searchPressed]);

  return (
      <StripedTableComponent>
        <thead className="text-primary">
          <tr>
            <th>CNPJ</th>
            <th>Empresa</th>
            <th>Ação</th>
          </tr>
        </thead>
          <tbody>
          { companies.map(data => {
            return (
              <tr key={data.id}>
                <td>{cpfCnpjMask(data.cnpj)}</td>
                <td>{data.name}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Basic example">
                    <Link to={urls.companyEdit.replace(urls.idParam, data.id)}>
                      <button type="button" className="btn btn-outline-info">
                        <VscEdit size="14"/>
                      </button>
                    </Link>
                  </div>  
                </td>
              </tr>
            )
          })}
        </tbody>
        
      </StripedTableComponent>
  )
}