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
  const next = () => {
    addData();
    setPage2(0);
    setPage1(0);
    setPage3(1);
  }
  const prev = () => {
    addData();
    setPage2(0);
    setPage1(1);
    setPage3(0);
  }
  var previewdata;
  const PreviewBox = (props) => {
    const [value, setValue] = useState(props.item);
    return (
      <input className='w-32 border-[1px] py-2  border-[#e6e6e6]' value={value} onChange={(e) => { setValue(e.target.value); previewdata[props.rownumber][props.columnnumber] = value; console.log(props.rownumber, props.columnnumber, previewdata[props.rownumber][props.columnnumber]); }}></input>
    )
  }
  const PreviewRow = (props) => {
    const [item, setItem] = useState(props.row);
    return (
      item.map((o, index) => (
        <div>
          <PreviewBox item={o} rownumber={props.rownumber} columnnumber={index} />
        </div>
      ))
    )
  }

  const [k, setK] = useState(0);
  const Preview = () => {
    const next = () => {
      console.log(previewdata);
      setDatax(previewdata);
      pushData();
    }
    const prev = () => {
      setPage3(0);
      setPage2(1);
    }
    const [x, setX] = useState(0);
    const handle = (e) => {
      setX(e.target.value);
    }
    previewdata = datax;
    return (
      <div>
        <div className='flex flex-col mt-10 items-center'>
          <div className='flex bg-[#e6e6e6] rounded-t-lg text-[18px] font-semibold'>
            <div className='w-32 border-r-[1px] py-2  border-white'>
              Index
            </div>
            {activeheader.map((item) => (
              <div className='w-32 border-r-[1px] py-2  border-white'>
                {item}
              </div>
            ))}
          </div>
          <div className=''>
            {previewdata.map((item, index) => (
              <div className='flex '>
                <div className='w-32 border-[1px] py-2  border-[#e6e6e6]'>{index + 1}</div>
                <PreviewRow row={item} rownumber={index} />
              </div>
            )
            )}
          </div>

        </div>
        <div className='flex justify-center gap-2'>
          <div onClick={prev} className="bg-blue-100 px-4 py-2 rounded-lg mt-5 cursor-pointer text-center">
            Prev
          </div>
          <div onClick={next} className=" bg-blue-100 px-4 py-2 rounded-lg mt-5 cursor-pointer text-center">
            Next
          </div>
        </div>
      </div >
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
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(0);
  const [page3, setPage3] = useState(0);


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
    setPage2(1);
    setPage1(0);
  };
  const map1 = new Map();
  const [mapp, setMapp] = useState();
  const Mapping = (props) => {

    map1.set(activeheader[props.index], "Select a column");
    for (let i = 0; i < headers.length; i++) {
      if (activeheader[props.index].toLowerCase() == headers[i].toLowerCase()) {
        map1.set(activeheader[props.index], headers[i],);
      }
    }


    const handle = (e) => {
      map1.set(activeheader[props.index], e.target.value,);
    }
    const reset = () => {
      map1.set(activeheader[props.index], "Select a column",);
    }

    return (
      <div className='flex border '>
        <div className='w-4/12 text-left pl-10 py-3  border-r'>{activeheader[props.index]}</div>
        <div className='w-8/12 text-left pl-10 py-3'>
          <select onChange={handle} className="border w-10/12">
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
          <button onClick={reset}>
            Reset
          </button>
        </div>

      </div>
    )

  }

  const headerKeys = Object.keys(Object.assign({}, ...array));

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        {page1 ? <div><form>
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
        </div>
          :
          <></>
        }


        {page2 ?
          <div className='mt-10'>
            <div className=''>
              <div className='flex justify-center align-center py-2 text-[18px] font-semibold border-2 bg-[#e6e6e6] rounded-t-lg'>
                <div className='w-4/12 text-left pl-10'>
                  Field
                </div>
                <div className='w-8/12 text-left pl-10 '>
                  Field Columns
                </div>
              </div>
              {activeheader.map((item, index) => (
                <div>
                  <Mapping index={index} />
                </div>
              ))}
            </div>
          </div>
          : <>
          </>
        }
      </div>
      {
        page2 ?

          <div className='flex justify-center gap-2'>
            <div onClick={prev} className="bg-blue-100 px-4 py-2 rounded-lg mt-5 cursor-pointer text-center">
              Prev
            </div>
            <div onClick={next} className=" bg-blue-100 px-4 py-2 rounded-lg mt-5 cursor-pointer text-center">
              Next
            </div>
          </div>
          : <></>
      }

      {page3 ? <Preview /> : <></>}
    </div >
  );
};

export default SheetEditor;
