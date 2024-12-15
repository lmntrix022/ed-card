"use client";  // Indiquer que c'est un composant côté client

import { useState } from "react";
import { QRCode } from "qrcode.react";  // Importer QRCode de 'qrcode.react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  // N'oublie pas d'importer FontAwesomeIcon pour utiliser l'icône


const QRCodeButton = ({ uri }) => {
  const [showQRCode, setShowQRCode] = useState(false);

  const handleQRCodeClick = () => {
    setShowQRCode(!showQRCode);  // Basculer l'état pour afficher/masquer le QR Code
  };

  return (
    <div>
      {/* Bouton pour afficher/masquer le QR Code */}
      <button
        onClick={handleQRCodeClick}
        className="px-6 rounded-full bg-gray-700 text-white shadow-lg hover:bg-[#fff] hover:text-gray-700 transition flex items-center"
      >
        <FontAwesomeIcon icon={faQrcode} className="mr-2" />
        QR Code
      </button>

      {/* Affichage du QR Code si l'état est true */}
      {showQRCode && (
        <div className="mt-6">
          <QRCode value={`http://localhost/quantin`} size={256} />
        </div>
      )}
    </div>
  );
};

export default QRCodeButton;  // Assurez-vous que le composant est exporté par défaut
