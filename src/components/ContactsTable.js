import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TablePagination,
  Chip,
  Tooltip,
  Box,
  IconButton,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, MoreVert } from "@mui/icons-material";

const ContactsTable = ({ contacts, loading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [checkedContacts, setCheckedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Gérer le tri des colonnes
  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const sortedContacts = contacts.sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    return sortOrder === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleCheck = (contactId) => {
    setCheckedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedContacts([]);
    } else {
      setCheckedContacts(filteredContacts.map((contact) => contact._id));
    }
    setSelectAll(!selectAll);
  };
  

  // Gérer la pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredContacts = sortedContacts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Affichage de la table
  return (
    <TableContainer component={Paper} elevation={3} className="rounded-xl bg-white bg-opacity-20 backdrop-blur-lg shadow-2xl border-t-4 border-pink-600 font-sans">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  {[
                    { label: "Nom", column: "name" },
                    { label: "Entreprise", column: "company" },
                    { label: "Email", column: "email" },
                  ].map(({ label, column }) => (
                    
                    <TableCell key={column} align="left" onClick={() => handleSort(column)}>
                        <Tooltip title="Filtrer" arrow>
                          <Box display="flex" alignItems="center" sx={{ cursor: "pointer" }}>
                            {label}
                            {sortColumn === column && (
                              sortOrder === "asc" ? (
                                <ArrowUpward fontSize="small" />
                              ) : (
                                <ArrowDownward fontSize="small" />
                              )
                            )}
                          </Box>
                        </Tooltip>
                      
                    </TableCell>
                   
                  ))}        
                  <TableCell className="text-blue-950" align="left">Rôle</TableCell>
                  <TableCell className="text-blue-950" align="left">Statut</TableCell>
                  <TableCell className="text-blue-950" align="left">Site web</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => {
                  const colors = ["bg-pink-50", "bg-pink-100", "bg-pink-200", "bg-pink-300", "bg-pink-400", "bg-pink-500", "bg-pink-600","bg-pink-700", "bg-orange-600", "bg-orange-100", "bg-orange-200", "bg-orange-300", "bg-orange-400", "bg-orange-500"];
                  const randomColor = colors[Math.floor(Math.random() * colors.length)];

                  return (
                    <TableRow key={contact._id} hover className="transition-all">
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={checkedContacts.includes(contact._id)}
                          onChange={() => handleCheck(contact._id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {contact.avatar ? (
                            <img
                              src={contact.avatar}
                              alt={contact.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                          ) : (
                            <div
                              className={`w-10 h-10 rounded-full ${randomColor} flex items-center justify-center text-white font-bold mr-3`}
                            >
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-blue-950 hover:underline"
                              title={`Appeler ${contact.name}`}
                            >
                              {contact.name}
                            </a>
                            <a
                              href={`tel:${contact.phone}`}
                              className="text-sm text-gray-500 hover:underline"
                              title={`Appeler ${contact.name}`}
                            >
                              {contact.phone}
                            </a>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{contact.company}</TableCell>

                      <TableCell>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-950 hover:underline"
                          title={`Envoyer un email à ${contact.email}`}
                        >
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell>{contact.role}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.status}
                          color={
                            contact.status === "Client"
                              ? "primary"
                              : contact.status === "Partenaire"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </TableCell>
                      
                      <TableCell>
                        <a
                          href={contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-950 hover:underline"
                          title={`Visiter le site web`}
                        >
                          {contact.website.replace('https://', '').replace('http://', '')}
                        </a>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={filteredContacts.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Contacts par page"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count}`}
            />
        </TableContainer>
      );
};

export default ContactsTable;
