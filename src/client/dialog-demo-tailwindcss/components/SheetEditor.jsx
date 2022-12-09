import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FormInput from './FormInput';
import SheetButton from './SheetButton';
import Papa from "papaparse";
// This is a wrapper for google.script.run that lets us use promises.
import { serverFunctions } from '../../utils/serverFunctions';

const allowedExtension = ["csv"];


const SheetEditor = () => {
  const [names, setNames] = useState([]);

  useEffect(() => {
    // Call a server global function here and handle the response with .then() and .catch()
    serverFunctions.getSheetsData().then(setNames).catch(alert);
  }, []);

  const deleteSheet = (sheetIndex) => {
    serverFunctions.deleteSheet(sheetIndex).then(setNames).catch(alert);
  };

  const setActiveSheet = (sheetName) => {
    serverFunctions.setActiveSheet(sheetName).then(setNames).catch(alert);
  };

  const [datax, setDatax] = useState([]);
  var data = [];
  const addData = async () => {
    data = [];
    var temp = [];
    console.log(array, headers, map1);
    for (var i = 0; i < array.length; i++) {
      var temp = [];
      for (var j = 0; j < activeheader.length; j++) {
        if (array[i][map1.get(activeheader[j])] == undefined) {
          var t = map1.get(activeheader[j]);
          t += "\r"; temp.push(array[i][t]);
        }
        else {
          temp.push(array[i][map1.get(activeheader[j])]);
        }
      }

      data.push(temp);
    }
    setDatax(data);
    setK(1);
  }
  const pushData = () => {
    serverFunctions.setData(datax);
  }
  const showPreview = () => {
    addData();
    setShowFinalData(1);
    setShowImport(0);
  }

  const [k, setK] = useState(0);
  const Preview = () => {
    useEffect(() => {

    })
    const handle1 = () => {
      console.log("Submit");
      pushData();
    }
    return (
      <div>
        <div className='flex flex-col mt-10 items-center'>
          {datax.map((item) => (
            <div className='flex gap-10'>
              {item.map((o) => (
                <div>{o}</div>
              ))}
            </div>
          )
          )}
        </div>
        <div onClick={handle1} className="mt-5 cursor-pointer">
          Sumbit
        </div>
      </div>
    )
  }

  // You can also use async/await notation for server calls with our server wrapper.
  // (This does the same thing as .then().catch() in the above handlers.)
  const submitNewSheet = async (newSheetName) => {
    try {
      const response = await serverFunctions.addSheet(newSheetName);
      setNames(response);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert(error);
    }
  };

  const [file, setFile] = useState();
  const [array, setArray] = useState([]);
  const [headers, setHeader] = useState([]);
  const [activeheader, setActiveHeader] = useState([]);
  const [dataloaded, setDataLoaded] = useState(0);
  const [showfinaldata, setShowFinalData] = useState(0);
  const [showimport, setShowImport] = useState(1);

  const fileReader = new FileReader();

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };




  const csvFileToArray = async (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    setHeader(csvHeader);
    const array = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    setArray(array);
    var fulldata = await serverFunctions.getData();
    setActiveHeader(fulldata[0]);
    setDataLoaded(1);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };
  const map1 = new Map();
  const Mapping = (props) => {
    map1.set(activeheader[props.index], " ");
    for (let i = 0; i < headers.length; i++) {
      if (activeheader[props.index].toLowerCase() == headers[i].toLowerCase()) {
        console.log(activeheader[props.index].toLowerCase(), headers[i].toLowerCase());
        map1.set(activeheader[props.index], headers[i],);
      }
    }

    console.log(map1);
    const handle = (e) => {
      map1.set(activeheader[props.index], e.target.value,);
    }

    return (
      <div>
        <label for="cars">Choose maping for {activeheader[props.index]}</label>
        <select onChange={handle}>
          <option>{map1.get(activeheader[props.index])}</option>
          {headers.map((item, index) =>
          (
            item != map1.get(activeheader[props.index]) ?
              <option>{item}</option>
              : <>
              </>
          )
          )
          }
        </select>

      </div>
    )

  }

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {showimport ? <div><form>
          <input
            type={"file"}
            id={"csvFileInput"}
            accept={".csv"}
            onChange={handleOnChange}
          />

          <button
            onClick={(e) => {
              handleOnSubmit(e);
            }}
          >
            IMPORT CSV
          </button>
        </form>

          <br />

          <table>
            <thead>
              <tr key={"header"}>
                {headerKeys.map((key) => (
                  <th>{key}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {array.map((item) => (
                <tr key={item.id}>
                  {Object.values(item).map((val) => (
                    <td>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={showPreview}>
            Add
          </button>


          <div className='mt-10'>
            {activeheader.map((item, index) => (
              <div>
                <Mapping index={index} />
              </div>
            ))}
          </div>
        </div> :
          <></>
        }

        {showfinaldata ? <Preview /> : <></>}
      </div>
    </div>
  );
};

export default SheetEditor;
