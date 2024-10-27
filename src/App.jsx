import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import { JSEncrypt } from 'jsencrypt';
import './App.css';

function App() {
  // Hashing states
  const [hashInput, setHashInput] = useState('');
  const [md5Hash, setMd5Hash] = useState('');
  const [sha512Hash, setSha512Hash] = useState('');

  // RSA states
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [receiverPublicKey, setReceiverPublicKey] = useState('');
  const [rsaInput, setRsaInput] = useState('');
  const [encryptedTextRSA, setEncryptedTextRSA] = useState('');
  const [decryptedTextRSA, setDecryptedTextRSA] = useState('');
  const [tempPrivateKey, setTempPrivateKey] = useState('');

  // DES states
  const [desKey, setDesKey] = useState('');
  const [desInput, setDesInput] = useState('');
  const [encryptedTextDES, setEncryptedTextDES] = useState('');
  const [decryptedTextDES, setDecryptedTextDES] = useState('');

  // Error message state
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (hashInput) {
      setMd5Hash(CryptoJS.MD5(hashInput).toString());
      setSha512Hash(CryptoJS.SHA512(hashInput).toString());
    } else {
      setMd5Hash('');
      setSha512Hash('');
    }
  }, [hashInput]);

  const generateRSAKeys = () => {
    const encrypt = new JSEncrypt();
    encrypt.getKey(); // Generate keys
    const generatedPublicKey = encrypt.getPublicKey().replace(/(.{64})/g, '$1\n'); // Format for display
    const generatedPrivateKey = encrypt.getPrivateKey().replace(/(.{64})/g, '$1\n'); // Format for display

    setPublicKey(generatedPublicKey);
    setPrivateKey(generatedPrivateKey);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  const handleEncryptRSA = () => {
    if (!receiverPublicKey || !rsaInput) {
      setErrorMessage('Please provide a receiver public key and text to encrypt.');
      return;
    }

    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(receiverPublicKey);
    const encrypted = encrypt.encrypt(rsaInput);

    if (encrypted) {
      setEncryptedTextRSA(encrypted);
      setErrorMessage('');
    } else {
      setErrorMessage('Encryption failed. Check the public key.');
    }
  };

  const handleDecryptRSA = () => {
    if (!tempPrivateKey || !encryptedTextRSA) {
      setErrorMessage('Please provide a private key and encrypted text to decrypt.');
      return;
    }

    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(tempPrivateKey);
    const decrypted = decrypt.decrypt(encryptedTextRSA);

    if (decrypted) {
      setDecryptedTextRSA(decrypted);
      setErrorMessage('');
    } else {
      setErrorMessage('Decryption failed. Check the private key.');
    }
  };

  const handleEncryptDES = () => {
    if (!desKey || !desInput) {
      setErrorMessage('Please provide a DES key and text to encrypt.');
      return;
    }

    const encrypted = CryptoJS.DES.encrypt(desInput, desKey).toString();
    setEncryptedTextDES(encrypted);
    setErrorMessage('');
  };

  const handleDecryptDES = () => {
    if (!desKey || !encryptedTextDES) {
      setErrorMessage('Please provide a DES key and encrypted text to decrypt.');
      return;
    }

    const decrypted = CryptoJS.DES.decrypt(encryptedTextDES, desKey).toString(CryptoJS.enc.Utf8);

    if (decrypted) {
      setDecryptedTextDES(decrypted);
      setErrorMessage('');
    } else {
      setErrorMessage('Decryption failed. Check the key.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-5 ">
      <h1 className="text-3xl font-bold mb-6">Hashing & Encryption Demo</h1>

      <div className='w-full border h-screen flex justify-center items-center'>

        {/* Hashing Section */}
        <div className=" bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg flex justify-center items-center flex-col ">

          <h2 className="text-xl font-semibold mb-4">Hashing</h2>

          <input
            type="text"
            placeholder="Enter text to hash"
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />

          <div className="mb-2 w-full">
            <div className='text-center w-full font-bold flex '>MD-5 Hash :</div>
            <div className="overflow-auto border border-gray-300 rounded-md p-3 mt-2 h-32 text-sm leading-6" style={{ maxHeight: '50px' }}>
               {md5Hash}
            </div>
          </div>
          <div className="mb-2  w-full ">
            <div className='text-center w-full font-bold flex '>SHA-512 Hash :</div>
            {
              sha512Hash ? 
              <div className="overflow-y-auto bg-white border border-gray-300 rounded-md p-3 mt-2 h-32 text-sm leading-6" style={{ wordBreak: 'break-all' }}>
                {sha512Hash}
              </div> :
              <div className='text-center'>No Input </div>
            }
          </div>
        </div>

      </div>

      <div className='w-full border h-screen flex justify-center items-center'>
        {/* RSA Encryption Section */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full ">

          <h2 className="text-xl font-semibold mb-4">RSA Encryption</h2>
          <button
            onClick={generateRSAKeys}
            className="bg-gray-500 text-white rounded px-4 py-2 mb-4"
          >
            Generate RSA Keys
          </button>

          <div className='flex w-full'>

            <div className="mb-4 w-1/2 mx-2">
              <strong>Your Public Key:</strong>
              <div className="overflow-auto border p-2 h-20 rounded-lg" >
                {publicKey}
              </div>
              <button onClick={() => handleCopyToClipboard(publicKey)} className="bg-blue-500 text-white rounded px-4 py-2 mt-2 ">
                Copy Public Key
              </button>
            </div>

            <div className="mb-4 w-1/2 mx-2">
              <strong>Your Private Key:</strong>
              <div className="overflow-auto border p-2 h-20 rounded-lg" >
                {privateKey}
              </div>
              <button onClick={() => handleCopyToClipboard(privateKey)} className="bg-blue-500 text-white rounded px-4 py-2 mt-2 my-4">
                Copy Private Key
              </button>
            </div>

          </div>

          <div className='w-full flex'>

            <div className='flex justify-center items-center w-1/2 border py-4 flex-col mx-2'>
              <div className='font-bold text-2xl my-2'>Encryption</div>
              <input
                type="text"
                placeholder="Enter receiver public key"
                value={receiverPublicKey}
                onChange={(e) => setReceiverPublicKey(e.target.value)}
                className="border border-gray-300 rounded p-2 w-1/2 my-4 mx-2"
              />
              <input
                type="text"
                placeholder="Enter text to encrypt"
                value={rsaInput}
                onChange={(e) => setRsaInput(e.target.value)}
                className="border border-gray-300 rounded p-2 w-1/2 my-4 mx-2"
              />

              <button
                onClick={handleEncryptRSA}
                className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
              >
                Encrypt (RSA)
              </button>

              <div className="mb-2 w-[80%]">
                <strong>Encrypted Text (RSA):</strong>
                <div className="overflow-y-auto bg-white  rounded-md p-3 mt-2 h-32 text-sm leading-6" style={{ wordBreak: 'break-all' }} >
                  {encryptedTextRSA}
                </div>
              </div>
            </div>

            <div className='flex justify-center items-center w-1/2 border py-4 flex-col mx-2'>
              <div className='font-bold text-2xl my-2'>Decryption</div>

              <input
                type="text"
                placeholder="Enter your private key"
                value={tempPrivateKey}
                onChange={(e) => setTempPrivateKey(e.target.value)}
                className="border border-gray-300 rounded p-2 w-1/2 my-4 mx-2"
              />

              {/* Manual input for encrypted text */}
              <input
                type="text"
                placeholder="Enter encrypted text"
                value={encryptedTextRSA}
                onChange={(e) => setEncryptedTextRSA(e.target.value)}
                className="border border-gray-300 rounded p-2 w-1/2 my-4 mx-2"
              />

              <button
                onClick={handleDecryptRSA}
                className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
              >
                Decrypt (RSA)
              </button>

              <div className="mb-2 w-[80%]">
                <strong>Decrypted Text (RSA):</strong>
                <div className="overflow-y-auto bg-white  rounded-md p-3 mt-2 h-32 text-sm leading-6" >
                  {decryptedTextRSA}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <div className='w-full border h-screen flex justify-center items-center'>

        {/* DES Encryption Section */}
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">DES Encryption</h2>
                <input
                  type="text"
                  placeholder="Enter DES key"
                  value={desKey}
                  onChange={(e) => setDesKey(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full mb-4"
                />
                <input
                  type="text"
                  placeholder="Enter text to encrypt"
                  value={desInput}
                  onChange={(e) => setDesInput(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full mb-4"
                />
                <button
                  onClick={handleEncryptDES}
                  className="bg-blue-500 text-white rounded px-4 py-2 mb-4"
                >
                  Encrypt (DES)
                </button>
                <div className="mb-2">
                  <strong>Encrypted Text (DES):</strong>
                  <div className="overflow-auto" style={{ maxHeight: '50px' }}>
                    {encryptedTextDES}
                  </div>
                </div>
                <button
                  onClick={handleDecryptDES}
                  className="bg-green-500 text-white rounded px-4 py-2 mb-4"
                >
                  Decrypt (DES)
                </button>
                <div className="mb-2">
                  <strong>Decrypted Text (DES):</strong>
                  <div className="overflow-auto" style={{ maxHeight: '50px' }}>
                    {decryptedTextDES}
                  </div>
                </div>
        </div>

        </div> 



        {/* Error Message */}
        {errorMessage && (
        <div className="text-red-500 mt-4">
          {errorMessage}
        </div>
        )}
    </div>
  );
}

export default App;
