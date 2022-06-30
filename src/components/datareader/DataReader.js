import React, { useEffect, useState } from "react";
import "./datareader.scss";

function DataReader() {
  const [file, setFile] = useState(); // use for save the file
  const [data, setData] = useState([]); // use for save the data
  const [array, setArray] = useState([]); // use for save the data if no filter is working
  const [pin, setPin] = useState(""); // for pincode search
  const [date, setDate] = useState(""); // for date search

  const processCSV = (str) => {
    const heading = str.slice(0, str.indexOf("\n")).split(","); // for heading split
    const rows = str.slice(str.indexOf("\n") + 1).split("\n"); // for row split

    var indexh = heading.indexOf(heading[heading.length - 1]);
    if (indexh !== -1) {
      const val = heading[heading.length - 1].split("\r"); //use for removing "/r" from last heading item
      heading[indexh] = val[0];
    }

    // console.log(heading);

    const newArray = rows.map((row) => {
      const values = row.split(","); //getting all rows and split them

      var index = values.indexOf(values[values.length - 1]);
      if (index !== -1) {
        const array = values[values.length - 1].split(";"); //remove ";" from all the items in order.items
        values[index] = array.slice(0, array.length - 1);
      }

      const eachObject = heading.reduce((obj, header, i) => {
        //creating all object
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });

    setData(newArray); //for filtering the array
    setArray(newArray); // if all the filter is empty then this backup arrray works
  };

  const fileReader = new FileReader(); //for file reading

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    // getting the file by target
    e.preventDefault();

    if (file) {
      fileReader.onload = function (e) {
        const csv = e.target.result;
        processCSV(csv);
      };
      fileReader.readAsText(file);
    }
  };

  const headerKeys = Object.keys(Object.assign({}, ...data)); //Assigning the header keys for table

  const searchBtn = () => {
    if (pin.length !== 0 || date.length !== 0 ) {
      //search by date and pincode
      var newData;
      if(pin.length==0 || date.length!==0){
        newData = [...array];
      }else if(pin.length!==0 || date.length==0){
        newData = [...array];
      }
      console.log(newData);
      const filterArray = newData.filter((order) => {
        if(pin.length !== 0 && date.length !== 0 ){
          return order.orderDate === date && order.deliveryPincode === pin;
        }
        else {
          return order.orderDate === date || order.deliveryPincode === pin;
        }
      });
      {
        filterArray.length == 0
          ? alert("Enter correct Date/Pincode")
          : setData(filterArray);
      }
      console.log(filterArray);
    }

    if (pin.length == 0 && date.length == 0 ) {
      setData(array);
    }
  };
  console.log(data);
  return (
    <div className="main">
      {/* main form which is use for reading csv file */}
      <div className="datareader">
        <form id="csvform">
          <input
            type="file"
            accept=".csv"
            id="csvfile"
            onChange={handleOnChange}
          ></input>
          <br />
          <button
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            Import CSV
          </button>
        </form>
      </div>

      {/* Use for all search part  */}
      <div className="search">
        <div className="searchdiv">
          <div className="searchbypincode">
            <label>Pincode:</label>
            <input
              type="text"
              placeholder="000000"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <div className="searchbydate">
            <label>Date:</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="searchbtn">
          <button
            onClick={() => {
              searchBtn(pin, date);
            }}
          >
            Search
          </button>
        </div>
      </div>
      {/* Use for display the order list */}
      <div className="orderlist">
        {data.length == 0 ? (
          <div className="choosefile">
            <h1>Choose Your Order List CSV File </h1>
          </div>
        ) : (
          <table className="ordertable">
            <thead>
              <tr key={"header"}>
                {headerKeys.map((key) => (
                  <th>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data
                .map((item) => (
                  <tr key={item.id}>
                    {Object.values(item).map((val) => (
                      <>
                        {Array.isArray(val) ? (
                          <td>
                            {val.map((i) => (
                              <tr className="items">{i}</tr>
                            ))}
                          </td>
                        ) : (
                          <td>{val}</td>
                        )}
                      </>
                    ))}
                  </tr>
                ))
                .slice(0, 10)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DataReader;
