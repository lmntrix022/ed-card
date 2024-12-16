"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import AddContact from "../../../components/contactForm/contactForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  InputAdornment,
  CircularProgress,
  Box,
  Checkbox,
  Chip,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TablePagination,
  Menu,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreHoriz";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Close as CloseIcon, ArrowUpward, ArrowDownward } from "@mui/icons-material";
import * as XLSX from "xlsx";

export default function ContactPage() {
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedContacts, setCheckedContacts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("/api/contact/all");
        if (!res.ok) throw new Error("Erreur lors de la récupération des contacts");

        const data = await res.json();
        setContacts(data.contacts);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const debouncedSearchQuery = useMemo(() => {
    let handler;
    clearTimeout(handler);
    handler = setTimeout(() => searchQuery, 300);
    return searchQuery;
  }, [searchQuery]);

  const sortedContacts = useMemo(() => {
    if (!sortColumn) return contacts;
    return [...contacts].sort((a, b) => {
      const aValue = a[sortColumn] ?? "";
      const bValue = b[sortColumn] ?? "";
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [contacts, sortColumn, sortOrder]);

  const filteredContacts = useMemo(() => {
    return sortedContacts.filter((contact) => {
      const matchesSearchQuery =
        contact.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesStatusFilter = filterStatus === "" || contact.status === filterStatus;

      return matchesSearchQuery && matchesStatusFilter;
    });
  }, [sortedContacts, debouncedSearchQuery, filterStatus]);

  const handleToggleForm = () => setShowForm((prevState) => !prevState);

  const handleSort = (column) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortColumn(column);
    setSortOrder(isAsc ? "desc" : "asc");
  };

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

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const showError = (message) => setSnackbar({ open: true, message, severity: "error" });
  const showSuccess = (message) => setSnackbar({ open: true, message, severity: "success" });

  const handleExportExcel = () => {
    const selectedContacts = filteredContacts.filter((contact) =>
      checkedContacts.includes(contact._id)
    );
    const ws = XLSX.utils.json_to_sheet(selectedContacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contacts");
    XLSX.writeFile(wb, "contacts.xlsx");
  };

  const handleDeleteContacts = async () => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer les contacts sélectionnés ?")) {
        const res = await fetch("/api/contact/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: checkedContacts }),
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression des contacts");

        setContacts((prev) => prev.filter((contact) => !checkedContacts.includes(contact._id)));
        setCheckedContacts([]);
        setSelectAll(false);
        showSuccess("Contacts supprimés avec succès.");
      }
    } catch (error) {
      console.error(error);
      showError("Une erreur est survenue lors de la suppression.");
    }
  };

  const hashCode = (str) =>
    str.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);

  
  
  const getColorFromHash = (name) => {
    const colors = ["bg-pink-200", "bg-blue-200", "bg-green-200"];
    return colors[Math.abs(hashCode(name)) % colors.length];
  };

  
  

  return (
    <div className="relative w-full h-screen">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-30">
        <source src="/video/bg-1.mp4" type="video/mp4" />
        Votre navigateur ne prend pas en charge la vidéo.
      </video>

      <div className="relative max-w-7xl mx-auto px-6 py-12 bg-white bg-opacity-40 backdrop-blur-lg rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-700 drop-shadow-lg">Mes Contacts</h1>
        <p className="text-xl text-gray-700 mb-6">Découvrez vos contacts et gérez-les facilement.</p>

        <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3} mb={6}>
          {/* Zone de recherche */}
          <TextField
            label="Rechercher"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "56px", // Hauteur standard
                backgroundColor: "transparent",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                "&:hover fieldset": {
                  borderColor: "rgb(219, 39, 119)",
                },
              },
            }}
          />

          {/* Zone de filtre avec icône et bouton à 3 points alignés horizontalement */}
          <div className="flex items-center space-x-2"> {/* Ajout de flex pour aligner horizontalement */}
            <FormControl variant="outlined" className="w-1/2">
              <InputLabel>Filtrer</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Filtrer"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "56px", // Alignement de la hauteur
                    "& .MuiSvgIcon-root": {
                      color: "rgb(219, 39, 119)", // Couleur de l'icône
                    },
                  },
                }}
                IconComponent={() => <FilterListIcon className="mr-2" />} // Icône de filtre
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Partenaire">Partenaire</MenuItem>
                <MenuItem value="Fournisseur">Fournisseur</MenuItem>
              </Select>
            </FormControl>


            {/* Nouveau bouton avec l'icône d'insertion */}
            <Tooltip title="Ajouter un contact" arrow>
              <IconButton
                className="bg-pink-600"
                onClick={handleToggleForm} // Ouvre/ferme le modal
                sx={{
                  color: "rgb(255, 255, 255)", // Couleur de l'icône
                  borderColor: "rgb(236, 72, 153)",
                  "&:hover": {
                    backgroundColor: "rgb(236, 72, 153)", // Couleur de fond au hover
                    color: "rgb(255, 255, 255)",
                  },
                }}
              >
                <AddIcon /> {/* Icône d'insertion */}
              </IconButton>
            </Tooltip>

            {/* Icône des trois points avec Menu */}
            {checkedContacts.length > 0 && (
              <Tooltip title="Plus d'action" arrow>
                <IconButton
                  onClick={handleMenuClick}
                  sx={{
                    color: "rgba(236, 72, 153)", // Couleur de l'icône
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
              
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {/* Option Export Excel */}
                <MenuItem onClick={() => { handleExportExcel(); handleMenuClose(); }}>
                  Export Excel
                </MenuItem>

                {/* Nouvelle option pour supprimer */}
                <MenuItem onClick={handleDeleteContacts}>
                  Supprimer
                </MenuItem>
              </Menu>
          </div>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : (
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
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl md:w-[45%]">
            <div className="flex justify-between items-center ">
            
            </div>
            <div className="">
              <button onClick={handleToggleForm} className="text-xl font-bold text-black -pb-16">
                <CloseIcon className="text-gray-500 " />
              </button>
              <AddContact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
