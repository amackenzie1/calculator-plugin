import ProjectionGraph from "@/components/ProjectionGraph"; // Import the dedicated graph component
import { CalculatorSchemaType } from "@/components/Schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ProjectionDataPoint, YearState } from "@/lib/calculator/projection"; // Assuming YearState is exported
import { generateExcelReport } from "@/lib/generateExcelReport"; // Ensure this is a static import for now
import { DownloadIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export interface ResultsCardProps {
  projectionData: ProjectionDataPoint[];
  calculatorInput?: CalculatorSchemaType;
  detailedProjectionStates: YearState[];
}

const ResultsCard: React.FC<ResultsCardProps> = ({ 
  projectionData, 
  calculatorInput, 
  detailedProjectionStates 
}) => {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadXLSX = async () => {
    console.log("[ResultsCard] handleDownloadXLSX triggered");

    if (!calculatorInput || !detailedProjectionStates || detailedProjectionStates.length === 0) {
      console.error("[ResultsCard] Data not available for Excel export. Input valid:", !!calculatorInput, "States valid:", !!detailedProjectionStates, "States length:", detailedProjectionStates?.length);
      toast({
        title: "Export Error",
        description: "Projection data is not available for export. Please calculate first.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("[ResultsCard] Data seems available. Proceeding to generate report.");
    setIsDownloading(true);

    try {
      console.log("[ResultsCard] Attempting to call generateExcelReport with:", { 
        statesCount: detailedProjectionStates.length,
        hasInput: !!calculatorInput
      });
      await generateExcelReport(detailedProjectionStates, calculatorInput);
      console.log("[ResultsCard] Excel report generation call completed.");
      toast({
        title: "Export Successful",
        description: "Your XLSX report has been downloaded.",
        variant: "default",
      });
    } catch (error) {
      console.error("[ResultsCard] Error during generateExcelReport call:", error);
      toast({
        title: "Export Failed",
        description: "Could not generate the XLSX report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">Financial Projection Results</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          This chart illustrates your projected net worth over time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {projectionData.length > 0 ? (
          <ProjectionGraph data={projectionData} />
        ) : (
          <p className="text-center text-muted-foreground">No projection data available. Please complete the previous steps and calculate.</p>
        )}
        <div className="flex justify-center mt-6">
          <Button onClick={handleDownloadXLSX} variant="default" size="lg" className="flex items-center gap-2" disabled={isDownloading}>
            {isDownloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <DownloadIcon size={18} />
            )}
            {isDownloading ? "Generating Report..." : "Download XLSX Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard; 