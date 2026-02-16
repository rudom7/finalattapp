import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, CircleDollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Import assets - fix path references
import logoImagePath from "@/lib/logos/ZesaLogo.png";
import stampImagePath from "@/lib/resources/stamp.jpg";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 12,
    color: "#333",
  },
  logo: {
    width: 100,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "bold",
  },
  text: {
    marginBottom: 5,
  },
  signatureSection: {
    marginTop: 40,
    borderTop: "1px solid #000",
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signature: {
    width: "45%",
    textAlign: "center",
  },
  stampSection: {
    marginTop: 20,
    textAlign: "center",
  },
  stamp: {
    width: 80,
    margin: "0 auto",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
  },
  tableCell: {
    flex: 1,
  },
  statusSection: {
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
  },
});

export function ReportDialog({ open, onOpenChange }: ReportDialogProps) {
  const [reportType, setReportType] = useState<"query" | "claim">("query");
  const [timeframe, setTimeframe] = useState<"30days" | "6months" | "1year">("30days");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ["/api/reports", reportType, timeframe],
    queryFn: async () => {
      const res = await fetch(`/api/reports?type=${reportType}&timeframe=${timeframe}`);
      if (!res.ok) throw new Error("Failed to fetch report data");
      return res.json();
    },
    enabled: false, // Don't fetch automatically
  });

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const result = await refetch();
      
      // After data is fetched, generate the PDF
      if (result.data) {
        await generatePDF();
      } else {
        toast({
          title: "No Data",
          description: "No data available for the selected criteria",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTimeframe = (tf: string) => {
    switch (tf) {
      case "30days": return "Last 30 Days";
      case "6months": return "Last 6 Months";
      case "1year": return "Last 1 Year";
      default: return tf;
    }
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const generatePDF = async () => {
    if (!reportData) return;
    
    // Create a function to generate the document
    const ReportDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <Image src={logoImagePath} style={styles.logo} />
          <View style={styles.section}>
            <Text style={styles.title}>
              {reportType === "query" ? "Query" : "Claim"} Report
            </Text>
            <Text style={styles.text}>
              Timeframe: {formatTimeframe(timeframe)}
            </Text>
            <Text style={styles.text}>
              Date Generated: {format(new Date(), "dd MMMM yyyy")}
            </Text>
            <Text style={styles.text}>
              Total {reportType === "query" ? "Queries" : "Claims"}: {reportData.stats.total}
            </Text>
          </View>

          {reportType === "query" && (
            <View style={styles.section}>
              <Text style={styles.subtitle}>Summary by Status</Text>
              
              <View style={styles.statusSection}>
                <Text style={styles.text}>Open Queries: {reportData.stats.open.length}</Text>
                {reportData.stats.open.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Title</Text>
                    <Text style={styles.tableCell}>Submitted</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.open.map((query: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{query.title}</Text>
                    <Text style={styles.tableCell}>{formatDate(query.submittedAt)}</Text>
                    <Text style={styles.tableCell}>{query.pensionerName}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.text}>In Progress Queries: {reportData.stats.in_progress.length}</Text>
                {reportData.stats.in_progress.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Title</Text>
                    <Text style={styles.tableCell}>Submitted</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.in_progress.map((query: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{query.title}</Text>
                    <Text style={styles.tableCell}>{formatDate(query.submittedAt)}</Text>
                    <Text style={styles.tableCell}>{query.pensionerName}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.text}>Resolved Queries: {reportData.stats.resolved.length}</Text>
                {reportData.stats.resolved.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Title</Text>
                    <Text style={styles.tableCell}>Submitted</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.resolved.map((query: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{query.title}</Text>
                    <Text style={styles.tableCell}>{formatDate(query.submittedAt)}</Text>
                    <Text style={styles.tableCell}>{query.pensionerName}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {reportType === "claim" && (
            <View style={styles.section}>
              <Text style={styles.subtitle}>Summary by Status</Text>
              
              <View style={styles.statusSection}>
                <Text style={styles.text}>Pending Claims: {reportData.stats.pending.length}</Text>
                {reportData.stats.pending.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Claim #</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.pending.map((claim: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{claim.claimNumber}</Text>
                    <Text style={styles.tableCell}>${claim.amount}</Text>
                    <Text style={styles.tableCell}>{claim.pensionerName}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.text}>Approved Claims: {reportData.stats.approved.length}</Text>
                {reportData.stats.approved.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Claim #</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.approved.map((claim: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{claim.claimNumber}</Text>
                    <Text style={styles.tableCell}>${claim.amount}</Text>
                    <Text style={styles.tableCell}>{claim.pensionerName}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.text}>Rejected Claims: {reportData.stats.rejected.length}</Text>
                {reportData.stats.rejected.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Claim #</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.rejected.map((claim: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{claim.claimNumber}</Text>
                    <Text style={styles.tableCell}>${claim.amount}</Text>
                    <Text style={styles.tableCell}>{claim.pensionerName}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.statusSection}>
                <Text style={styles.text}>Paid Claims: {reportData.stats.paid.length}</Text>
                {reportData.stats.paid.length > 0 && (
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableCell}>Claim #</Text>
                    <Text style={styles.tableCell}>Amount</Text>
                    <Text style={styles.tableCell}>Pensioner</Text>
                  </View>
                )}
                {reportData.stats.paid.map((claim: any, index: number) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{claim.claimNumber}</Text>
                    <Text style={styles.tableCell}>${claim.amount}</Text>
                    <Text style={styles.tableCell}>{claim.pensionerName}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.signatureSection}>
            <Text style={styles.signature}>
              Signature: ____________________
            </Text>
            <Text style={styles.signature}>Date: ________________________</Text>
          </View>

          <View style={styles.stampSection}>
            <Text>Official Stamp:</Text>
            <Image src={stampImagePath} style={styles.stamp} />
          </View>
        </Page>
      </Document>
    );

    try {
      const blob = await pdf(<ReportDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}-report-${timeframe}-${new Date().getTime()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Report downloaded successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Select the type of report and timeframe to generate
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-medium">Report Type</h4>
            <RadioGroup
              value={reportType}
              onValueChange={(value) => setReportType(value as "query" | "claim")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="query" id="report-type-query" />
                <Label htmlFor="report-type-query" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> Queries
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="claim" id="report-type-claim" />
                <Label htmlFor="report-type-claim" className="flex items-center gap-1">
                  <CircleDollarSign className="h-4 w-4" /> Claims
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <h4 className="mb-3 text-sm font-medium">Timeframe</h4>
            <RadioGroup
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as "30days" | "6months" | "1year")}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30days" id="timeframe-30days" />
                <Label htmlFor="timeframe-30days">30 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6months" id="timeframe-6months" />
                <Label htmlFor="timeframe-6months">6 months</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1year" id="timeframe-1year" />
                <Label htmlFor="timeframe-1year">1 year</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating || isLoading}>
            {(isGenerating || isLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate & Download'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}